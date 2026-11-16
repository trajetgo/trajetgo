import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "../layouts/app.layout";

// Pages
import Home from "../pages/Home";
import Bookings from "../pages/Bookings";
import Tickets from "../pages/Tickets";
import Profile from "../pages/Profile";
import Security from "../pages/Security";

export default function PassengerRouter() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="tickets" element={<Tickets />} />
                <Route path="profile" element={<Profile />} />
                <Route path="security" element={<Security />} />
            </Route>
        </Routes>
    )
}
