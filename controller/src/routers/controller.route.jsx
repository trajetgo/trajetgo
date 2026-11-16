import { Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "../pages/controller/Dashboard";

// Layouts
import AppLayout from "../layouts/app.layout";

export default function ControllerRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={<AppLayout />}
            >
                <Route index element={<Dashboard />} />
            </Route>
        </Routes>
    )
}