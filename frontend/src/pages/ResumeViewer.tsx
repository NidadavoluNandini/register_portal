import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

type LoggedInUser = {
  firstName: string;
  lastName: string;
  email: string;
  resumeUrl: string;
};

export default function ResumeViewer() {
  const navigate = useNavigate();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/");
      return;
    }

    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users/me");
        setUser(response.data as LoggedInUser);
        localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      } catch (err: any) {
        setError(err?.response?.data?.message || "Session expired. Please login again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("loggedInUser");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  if (loading) {
    return null;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-sky-900 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-2xl px-8 py-10">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
              Welcome back
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="mt-2 text-sm text-slate-300">{user.email}</p>
          </div>

          <div className="space-y-3">
            <a
              href={user.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/30 hover:brightness-110"
            >
              Open Resume
            </a>

            <button
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("loggedInUser");
                sessionStorage.clear();
                navigate("/", { replace: true });
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10"
            >
              Logout
            </button>

            {error && (
              <p className="text-xs text-red-300 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
