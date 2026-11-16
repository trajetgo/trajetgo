import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "../layouts/app.layout";

// Pages
import Home from "../pages/Home";

export default function PassengerRouter() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
            </Route>
        </Routes>
    )
}
