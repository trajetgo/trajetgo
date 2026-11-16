import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useSearchTrips() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        departure: null,
        arrival: null,
        date: "",
        passengers: {
            adults: 1,
            children: []
        }
    });

    const [openModal, setOpenModal] = useState({
        show: false,
        type: ""
    });

    const [swap, setSwap] = useState(false);


    /**
     * Ouvre un modal de recherche.
     *
     * type:
     * - departure
     * - arrival
     * - date
     * - passengers
     */
    const openSearchModal = (type) => {
        setOpenModal({
            show: true,
            type
        });
    };

    const closeSearchModal = () => {
        setOpenModal({
            show: false,
            type: ""
        });
    };

    /**
     * Sélection d'une ville
     */
    const selectCity = (city) => {
        if (openModal.type === "departure") {
            setFormData((prev) => ({
                ...prev,
                departure: city
            }));
        }

        if (openModal.type === "arrival") {
            setFormData((prev) => ({
                ...prev,
                arrival: city
            }));
        }

        closeSearchModal();
    };

    /**
     * Date
     */
    const selectDate = (date) => {
        setFormData((prev) => ({
            ...prev,
            date
        }));

        closeSearchModal();
    };

    /**
     * @param {{ adults: number, children: {id:string, age:number}[] }} passengers
     */
    const selectPassengers = (passengers) => {
        setFormData((prev) => ({
            ...prev,
            passengers: {
                adults: passengers.adults,
                children: passengers.children ?? [],
            },
        }));
        closeSearchModal();
    };

    /**
     * Inverser départ / arrivée
     */
    const handleSwap = () => {
        setFormData((prev) => ({
            ...prev,
            departure: prev.arrival,
            arrival: prev.departure
        }));

        setSwap((prev) => !prev);
    };

    /**
     * Rechercher les trajets
     */
    const handleSearch = () => {
        if (!formData.departure) {
            openSearchModal("departure");
            return;
        }

        if (!formData.arrival) {
            openSearchModal("arrival");
            return;
        }

        if (!formData.date) {
            openSearchModal("date");
            return;
        }

        /* ✅ On envoie les IDs des villes */
        const params = new URLSearchParams({
            from: formData.departure.id,
            fromName: formData.departure.name,        // ✅
            to: formData.arrival.id,
            toName: formData.arrival.name,             // ✅
            date: formData.date,
            adults: String(formData.passengers.adults),
        });

        if (formData.passengers.children.length > 0) {
            params.set(
                "children",
                formData.passengers.children.map((c) => c.age).join(",")
            );
        }

        navigate(`/trips?${params.toString()}`, {
            state: {
                departure: formData.departure,
                arrival: formData.arrival,
            },
        });
    };

    return {
        formData,
        setFormData,

        openModal,
        openSearchModal,
        closeSearchModal,

        selectCity,
        selectDate,
        selectPassengers,

        swap,
        handleSwap,
        handleSearch
    };
}