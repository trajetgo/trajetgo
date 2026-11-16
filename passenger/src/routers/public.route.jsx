import { Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/public/Home";
import Trips from "../pages/public/Trips";


// Layouts
import AppLayout from "../layouts/app.layout";
import Seats from "../pages/public/Seats";

export default function PublicRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={<AppLayout />}
            >
                <Route index element={<Home />} />

                <Route
                    path="/trips"
                    element={<Trips />}
                />

               <Route
                    path="/seats"
                    element={<Seats />}
                />

                {/*  <Route
                    path="/about"
                    element={<About />}
                />

                <Route
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
            </Route> */}

            {/* <Route path="/support" element={<SupportLayout />}>
                <Route
                    path="help-center"
                    element={<HelpCenter />}
                />

                <Route
                    path="faq"
                    element={<FAQ />}
                />

                <Route
                    path="contact"
                    element={<Contact />}
                />

                <Route
                    path="report"
                    element={<ReportIssue />}
                />
            </Route> */}
        </Routes>
    )
}