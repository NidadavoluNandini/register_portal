import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const email = localStorage.getItem("email");

  const verify = async () => {
    const res = await api.post("/auth/verify-otp", {
      email,
      otp,
    });

    // ✅ backend returns stored user data
    localStorage.setItem(
      "registerData",
      JSON.stringify(res.data.userData)
    );

    navigate("/upload");
  };

  return (
    <div>
      <h2>Verify OTP</h2>

      <input
        placeholder="Enter OTP"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={verify}>Verify</button>
    </div>
  );
}
