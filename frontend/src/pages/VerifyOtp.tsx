import { useState, useRef, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = localStorage.getItem("email");

  /* ---------------- OTP INPUT HANDLING ---------------- */

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const newOtp = pasted
      .split("")
      .concat(Array(6 - pasted.length).fill(""));

    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  /* ---------------- VERIFY OTP ---------------- */

  const verify = async () => {
    const code = otp.join("");
    if (code.length < 6 || !email) return;

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/verify-otp", {
        email,
        otp: code,
      });

      // save backend returned data if exists
      if (res.data?.userData) {
        localStorage.setItem(
          "registerData",
          JSON.stringify(res.data.userData)
        );
      }

      navigate("/upload");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */

  const resendOtp = async () => {
    if (!email || resendTimer > 0) return;

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/resend-otp", {
        email,
      });

      // clear inputs
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();

      // restart timer
      setResendTimer(30);

      // success feedback
      setError("New OTP sent successfully!");
      setTimeout(() => setError(""), 3000);
    } catch (err: any) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TIMER COUNTDOWN ---------------- */

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  /* ---------------- AUTO FOCUS ---------------- */

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-sky-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-2xl px-8 py-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
              Step 2 · Verify email
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              Enter verification code
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Code sent to{" "}
              <span className="text-sky-200 font-medium">
                {email || "your email"}
              </span>
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-200 text-center">
              {error}
            </div>
          )}

          {/* OTP INPUTS */}
          <div
            className="flex justify-center gap-3 p-2 bg-white/5 rounded-2xl border border-white/10"
            onPaste={handlePaste}
          >
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="h-14 w-14 rounded-xl border-2 border-white/20 bg-white/10 text-center text-xl font-mono text-white outline-none focus:border-sky-400 focus:bg-white/20"
              />
            ))}
          </div>

          {/* VERIFY BUTTON */}
          <button
            onClick={verify}
            disabled={loading || otp.join("").length < 6}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/30 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/register")}
            disabled={loading}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-50"
          >
            ← Edit details
          </button>

          {/* RESEND */}
          <button
            onClick={resendOtp}
            disabled={resendTimer > 0 || loading}
            className="mt-4 w-full text-xs text-sky-300 hover:text-sky-200 disabled:opacity-40 transition-colors"
          >
            {resendTimer > 0
              ? `Resend OTP in ${resendTimer}s`
              : "Didn't receive code? Send again"}
          </button>
        </div>
      </div>
    </div>
  );
}
