import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import UploadResume from "./pages/UploadResume";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import ResumeViewer from "./pages/ResumeViewer";

function ProtectedRoute() {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function VerifyRoute() {
  const email = localStorage.getItem("email");

  if (!email) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
}

function UploadRoute() {
  const registerData = localStorage.getItem("registerData");

  if (!registerData) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
}

function SuccessRoute() {
  const registrationDone = sessionStorage.getItem("registrationDone");

  if (registrationDone !== "true") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<VerifyRoute />}>
          <Route path="/verify" element={<VerifyOtp />} />
        </Route>
        <Route element={<UploadRoute />}>
          <Route path="/upload" element={<UploadResume />} />
        </Route>
        <Route element={<SuccessRoute />}>
          <Route path="/success" element={<RegistrationSuccess />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/resume" element={<ResumeViewer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
