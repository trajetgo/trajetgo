import { Routes, Route } from "react-router-dom";
import Cart from "../pages/checkout/Cart";

// Layouts
import AppLayout from "../layouts/app.layout";

export default function CheckoutRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={<AppLayout />}
            >
                <Route index element={<Cart />} />
                <Route path="/cart" element={<Cart />} />
            </Route>
        </Routes>
    )
}
