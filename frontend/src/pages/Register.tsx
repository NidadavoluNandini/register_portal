import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const submit = async () => {
    await api.post("/auth/initiate", form);

    // only save email for OTP step
    localStorage.setItem("email", form.email);

    navigate("/verify");
  };

  return (
    <div>
      <h2>Register</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          placeholder={key}
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
        />
      ))}

      <button onClick={submit}>Send OTP</button>
    </div>
  );
}
