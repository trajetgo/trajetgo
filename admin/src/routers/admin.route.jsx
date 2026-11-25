import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "../layouts/app.layout";

// Pages
import Dashboard from "../pages/Dashboard";
import Companies from "../pages/Companies";
import Agencies from "../pages/Agencies";
import Buses from "../pages/Buses";
import Locations from "../pages/Locations";
import TeamMembers from "../pages/TeamMembers";
import Lines from "../pages/Lines";
import Schedules from "../pages/Schedules";
import Trips from "../pages/Trips";
import Knowledge from "../pages/Knowledge";

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
                <Route path="/knowledge" element={<Knowledge />} />
            </Route>
        </Routes>
    )
}
