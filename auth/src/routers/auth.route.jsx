import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/auth.layout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import GuestGuard from "../components/guards/GuestGuard";
import VerifyEmail from "../pages/VerifyEmail";
import VerifyPhone from "../pages/VerifyPhone";
import RegisterSuccessPage from "../pages/RegisterSuccessPage";
import ForgotPassword from "../pages/ForgotPassword";
import ForgotPasswordSuccessPage from "../pages/ForgotPasswordSuccessPage";
import ResetPassword from "../pages/ResetPassword";

export default function AuthRouter() {
    return (
        <Routes>
            <Route element={<GuestGuard />}>
                <Route element={<AuthLayout />}>
                    <Route index element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/register/success" element={<RegisterSuccessPage />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/verify-phone" element={<VerifyPhone />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/forgot-password/success" element={<ForgotPasswordSuccessPage />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Route>
            </Route>
        </Routes>
    )
}