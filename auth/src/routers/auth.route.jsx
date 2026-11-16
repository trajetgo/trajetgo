import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/auth.layout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import GuestGuard from "../components/guards/GuestGuard";
// import VerifyEmail from "../pages/auth/VerifyEmail";
import VerifyPhone from "../pages/auth/VerifyPhone";

export default function AuthRouter() {
    return (
        <Routes>
            <Route element={<GuestGuard />}>
                <Route element={<AuthLayout />}>
                    <Route index element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* <Route path="verify-email" element={<VerifyEmail />} /> */}
                    <Route path="/verify-phone" element={<VerifyPhone />} />
                </Route>
            </Route>
        </Routes>
    )
}