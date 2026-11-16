import { useEffect, useState } from "react";
import service from "../services/booking.service";

export default function useBookings() {

    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [serverError, setServerError] = useState("");

    const fetchBookings = async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.my();
            if (!result.success) {
                setBookings([]);
                setServerError("");

                return;
            }

            setBookings(result.data);
        } catch (error) {
            setServerError("Erreur de connexion au serveur ! Réessayez plus tard.")
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return {
        loading,
        bookings,
        serverError,

        refresh: fetchBookings
    };
}
