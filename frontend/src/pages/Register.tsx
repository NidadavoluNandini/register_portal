import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const initialForm = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
  };

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const draft = localStorage.getItem("registerDraft");

    if (!draft) return;

    try {
      const parsed = JSON.parse(draft);
      setForm({
        ...initialForm,
        ...parsed,
      });
    } catch {
      localStorage.removeItem("registerDraft");
    }
  }, []);

  const getErrorMessage = (err: any) => {
    const message = err?.response?.data?.message;

    if (Array.isArray(message) && message.length) {
      return message[0];
    }

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (!err?.response) {
      return "Something went wrong. Please try again.";
    }

    return "Unable to complete registration. Please try again.";
  };

  const submit = async () => {
    if (!form.email || !form.firstName || !form.lastName || !form.phone) return;

    try {
      setLoading(true);
      setError("");
      await api.post("/auth/initiate", form);
      localStorage.setItem("email", form.email);
      localStorage.setItem("registerDraft", JSON.stringify(form));
      navigate("/verify");
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem("registerDraft", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-sky-900 flex items-center justify-center px-4">
      {/* Glow blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="relative rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-2xl px-8 py-10">
          {/* Accent ring */}
          <div className="pointer-events-none absolute -inset-[1px] rounded-3xl border border-white/10" />

          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
              Step 1 · Basic details
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Enter your details so we can send you a secure one-time passcode.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-200 text-center">
                {error}
              </div>
            )}

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-200">
                  First name
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-slate-900/40 focus:ring-2 focus:ring-sky-500/40"
                  placeholder="John"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-200">
                  Last name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-slate-900/40 focus:ring-2 focus:ring-sky-500/40"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Middle name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">
                Middle name (optional)
              </label>
              <input
                type="text"
                value={form.middleName}
                onChange={(e) => handleChange("middleName", e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-slate-900/40 focus:ring-2 focus:ring-sky-500/40"
                placeholder="Kumar"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">
                Email address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-slate-900/40 focus:ring-2 focus:ring-sky-500/40"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">
                Phone number
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 focus-within:border-sky-400 focus-within:bg-slate-900/40 focus-within:ring-2 focus-within:ring-sky-500/40">
                <span className="text-xs text-slate-300">+91</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full bg-transparent py-1.5 text-sm text-slate-50 placeholder:text-slate-400 outline-none"
                  placeholder="98765 43210"
                  required
                />
              </div>
            </div>

            {/* Helper text */}
            <p className="mt-2 text-[11px] text-slate-400">
              We’ll never share your details. OTP will be sent to your email for
              verification.
            </p>

            {/* Button */}
            <button
              type="button"
              onClick={submit}
              disabled={
                loading ||
                !form.email ||
                !form.firstName ||
                !form.lastName ||
                !form.phone
              }
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP & Continue"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10"
            >
              Already registered? Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
