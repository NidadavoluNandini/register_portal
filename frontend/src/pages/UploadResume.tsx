import { useState } from "react";
import api from "../api/api";

export default function UploadResume() {
  const [file, setFile] = useState<File | null>(null);

  const stored = JSON.parse(
    localStorage.getItem("registerData") || "{}"
  );

  const submit = async () => {
    if (!file) {
      alert("Upload resume");
      return;
    }

    const formData = new FormData();

    // backend-required fields
    formData.append("firstName", stored.firstName);
    formData.append("middleName", stored.middleName || "");
    formData.append("lastName", stored.lastName);
    formData.append("email", stored.email);
    formData.append("phone", stored.phone);

    formData.append("resume", file);

    await api.post("/users/create", formData);

    alert("Registration Completed ✅");

    localStorage.clear();
  };

  return (
    <div>
      <h2>Upload Resume</h2>

     <div>
  <label>
    Upload Resume
    <input
      type="file"
      accept=".pdf,.doc,.docx"
      title="Upload Resume"
      onChange={(e) =>
        setFile(e.target.files?.[0] || null)
      }
    />
  </label>
</div>


      <button onClick={submit}>Submit</button>
    </div>
  );
}
