import { useState, useCallback } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function UploadResume() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stored = JSON.parse(
    localStorage.getItem("registerData") || "{}"
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type and size
      if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(selectedFile.type)) {
        setError("Please upload PDF, DOC, or DOCX files only");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size must be less than 5MB");
        return;
      }

      setFile(selectedFile);
      setPreview(selectedFile.name);
      setError("");
    }
  }, []);

  const submit = async () => {
    if (!file) {
      setError("Please upload your resume");
      return;
    }

    if (!stored?.email || !stored?.firstName || !stored?.lastName || !stored?.phone) {
      setError("Session expired. Please register and verify OTP again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      // backend-required fields
      formData.append("firstName", stored.firstName);
      formData.append("middleName", stored.middleName || "");
      formData.append("lastName", stored.lastName);
      formData.append("email", stored.email);
      formData.append("phone", stored.phone);

      formData.append("resume", file);

      await api.post("/users/create", formData);

      sessionStorage.setItem("registrationDone", "true");
      localStorage.removeItem("registerData");
      localStorage.removeItem("email");
      localStorage.removeItem("registerDraft");
      navigate("/success");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-sky-900 flex items-center justify-center px-4">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="relative rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-2xl px-8 py-10">
          {/* Accent ring */}
          <div className="pointer-events-none absolute -inset-[1px] rounded-3xl border border-white/10" />

          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
              Step 3 · Complete registration
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Upload your resume
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              PDF, DOC, DOCX files only. Max 5MB. Secure upload and storage.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-200 text-center">
              {error}
            </div>
          )}

          {/* File upload area */}
          <div className="text-center">
            <div 
              className={`relative group border-2 border-dashed rounded-3xl p-12 transition-all ${
                file 
                  ? "border-sky-400 bg-sky-500/5 shadow-lg shadow-sky-500/20" 
                  : "border-white/20 hover:border-white/40 hover:bg-white/5"
              }`}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) {
                  const event = { target: { files: [droppedFile] } } as any;
                  handleFileChange(event);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {!file ? (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition">
                    <svg className="w-8 h-8 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-white mb-1">Drop your resume here</p>
                  <p className="text-sm text-slate-400 mb-6">or click to browse</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-2xl flex items-center justify-center border-2 border-green-500/40">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-white mb-1">{preview}</p>
                  <p className="text-sm text-sky-200 mb-6">✓ Valid file selected</p>
                </>
              )}
              
              <input
                type="file"
                accept=".pdf,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-3xl"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 mt-8">
            <button
              onClick={submit}
              disabled={!file || loading}
              className="w-full rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/30 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Uploading..." : "Complete Registration"}
            </button>

            <button
              onClick={() => navigate("/verify")}
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-50 transition-all"
            >
              ← Back to verification
            </button>
          </div>

          {/* File info */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-slate-400 text-center">
              Files are securely uploaded and stored encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
