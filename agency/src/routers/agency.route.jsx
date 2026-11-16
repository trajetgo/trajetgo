import { Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "../pages/company/Dashboard";
import Trips from "../pages/company/Trips";
import Agencies from "../pages/company/Agencies";
import Ticketing from "../pages/company/Ticketing";
import Teams from "../pages/company/Teams";
import Buses from "../pages/company/Buses";


// Layouts
import AppLayout from "../layouts/app.layout";

export default function AgencyRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={<AppLayout />}
            >
                <Route index element={<Dashboard />} />

                <Route path="/agencies" element={<Agencies />} />

                <Route
                    path="/trips"
                    element={<Trips />}
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

                {/*  <Route
                    path="/trips/:id"
                    element={<TripDetails />}
                /> */}
            </Route>


            {/* <Route path="/legal" element={<PolicyLayout />} >
                <Route
                    index
                    element={<Navigate to="terms" replace />}
                />
                <Route path="terms" element={<TermsOfUse />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="cookies" element={<CookiePolicy />} />
                <Route path="refunds" element={<RefundPolicy />} />
            </Route>

            <Route path="/support" element={<SupportLayout />}>
                <Route
                    path="/support/help-center"
                    element={<HelpCenter />}
                />

                <Route
                    path="/support/faq"
                    element={<FAQ />}
                />

                <Route
                    path="/support/contact"
                    element={<Contact />}
                />

                <Route
                    path="/support/report"
                    element={<ReportIssue />}
                />
            </Route> */}
        </Routes>
    )
}