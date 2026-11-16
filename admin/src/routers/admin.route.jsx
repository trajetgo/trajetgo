import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "../layouts/app.layout";

// Pages
import Dashboard from "../pages/admin/Dashboard";
import Companies from "../pages/admin/Companies";
import Agencies from "../pages/admin/Agencies";
import Buses from "../pages/admin/Buses";
import Locations from "../pages/admin/Locations";
import TeamMembers from "../pages/admin/TeamMembers";
import Lines from "../pages/admin/Lines";
import Schedules from "../pages/admin/Schedules";
import Trips from "../pages/admin/Trips";

export default function AdminRouter() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/agencies" element={<Agencies />} />
                <Route path="/teams" element={<TeamMembers />} />
                <Route path="/buses" element={<Buses />} />
                <Route path="/trips" element={<Trips />} />
                <Route path="/routes" element={<Lines />} />
                <Route path="/schedules" element={<Schedules />} />
                <Route path="/locations" element={<Locations />} />
            </Route>
        </Routes>
    )
}
