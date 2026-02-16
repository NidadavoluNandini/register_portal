import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import UploadResume from "./pages/UploadResume";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/upload" element={<UploadResume />} />
      </Routes>
    </BrowserRouter>
  );
}
