import { useNavigate } from "react-router-dom";

export default function RegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-sky-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-2xl px-8 py-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
            Registration Complete
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Resume uploaded successfully
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Your profile is saved. Please login to view your resume.
          </p>

          <button
            onClick={() => {
              sessionStorage.removeItem("registrationDone");
              navigate("/");
            }}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/30 hover:brightness-110"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
