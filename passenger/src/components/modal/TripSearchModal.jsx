import Modal from "@shared/components/ui/Modal";

import CitySelector from "../CitySelector";
import DateSelector from "../DateSelector";
import PassengerSelector from "../PassengerSelector";

export default function TripSearchModal({
    show,
    type,
    cities = [],
    citiesLoading = false,
    search = "",
    onSearchChange,
    formData = {
        departure: null,
        arrival: null,
        date: "",
        passengers: { adults: 1, children: [] },
    },
    onClose,
    onSelectCity,
    onSelectDate,
    onSelectPassengers,
}) {
    const getModalTitle = (type) => {
        switch (type) {
            case "departure":
                return "Choisissez votre départ";
            case "arrival":
                return "Où allez-vous ?";
            case "date":
                return "Date du voyage";
            case "passengers":
                return "Passagers";
            default:
                return "";
        }
    };

    const modalTitle = getModalTitle(type);

    return (
        <Modal isOpen={show} onClose={onClose} title={modalTitle}>
            <div className="trip-search-modal">
                {type === "departure" && (
                    <CitySelector
                        cities={cities}
                        loading={citiesLoading}
                        selectedCity={formData.departure}
                        onSelect={onSelectCity}
                        search={search}
                        onSearchChange={onSearchChange}
                    />
                )}

                {type === "arrival" && (
                    <CitySelector
                        cities={cities.filter(
                            (c) => c.id !== formData.departure?.id
                        )}
                        loading={citiesLoading}
                        selectedCity={formData.arrival}
                        onSelect={onSelectCity}
                        search={search}
                        onSearchChange={onSearchChange}
                    />
                )}

                {type === "date" && (
                    <DateSelector
                        initialDate={formData.date}
                        onSelect={onSelectDate}
                        onConfirm={onClose}
                    />
                )}

                {type === "passengers" && (
                    <PassengerSelector
                        value={formData.passengers}
                        onSelect={(payload) => {
                            onSelectPassengers(payload);
                            onClose();
                        }}
                    />
                )}
            </div>
        </Modal>
    );
}