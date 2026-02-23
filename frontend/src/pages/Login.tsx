import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onLogin = async () => {
    if (!email) {
      setError("Enter your email");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/users/login", { email });

      localStorage.setItem("authToken", response.data.accessToken);
      localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
      navigate("/resume");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-sky-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-2xl px-8 py-10">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
              Register Portal
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Login
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Returning user? Enter your registered email to view your resume.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-200 text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-slate-900/40 focus:ring-2 focus:ring-sky-500/40"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="button"
              onClick={onLogin}
              disabled={loading || !email}
              className="w-full rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10"
            >
              First time user? Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
