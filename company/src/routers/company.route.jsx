import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "../layouts/app.layout";

// Pages
import Dashboard from "../pages/Dashboard";
import Trips from "../pages/Trips";
import Agencies from "../pages/Agencies";
import Ticketing from "../pages/Ticketing";
import Teams from "../pages/Teams";
import Buses from "../pages/Buses";
import Schedules from "../pages/Schedules";
import Lines from "../pages/Lines";
import Integration from "../pages/integrations/Integration";
import Import from "../pages/integrations/Import";

export default function PublicRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={<AppLayout />}
            >
                <Route index element={<Dashboard />} />

                <Route
                    path="/agencies"
                    element={<Agencies />}
                />

                <Route
                    path="/routes"
                    element={<Lines />}
                />

                <Route
                    path="/trips"
                    element={<Trips />}
                />

                <Route
                    path="/schedules"
                    element={<Schedules />}
                />

                <Route
                    path="/ticketing"
                    element={<Ticketing />}
                />

                <Route
                    path="/buses"
                    element={<Buses />}
                />

                <Route
                    path="/teams"
                    element={<Teams />}
                />

                <Route
                    path="/integrations/tgtl"
                    element={<Integration />}
                />

                <Route
                    path="/integrations/tgtl/import/:step?"
                    element={<Import />}
                />
            </Route>
        </Routes>
    )
}