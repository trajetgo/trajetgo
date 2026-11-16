import { Routes, Route } from "react-router-dom";

// Layouts
import PolicyLayout from "../layouts/policy.layout";

// Pages
import Home from "../pages/Home";
import Privacy from "../pages/Privacy";
import Passengers from "../pages/Terms/Passengers";
import Companies from "../pages/Terms/Companies";
import Cookies from "../pages/Cookies";

export default function PolicyRouter() {
    return (
        <Routes>
            <Route path="/" element={<PolicyLayout />}>
                <Route index element={<Home />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route
                    path="/terms/passengers"
                    element={<Passengers />}
                />

                <Route
                    path="/terms/companies"
                    element={<Companies />}
                />
                <Route path="/cookies" element={<Cookies />} />
            </Route>
        </Routes>
    )
}
