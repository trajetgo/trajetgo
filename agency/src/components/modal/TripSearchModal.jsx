import CitySelector from "../CitySelector";
import DateSelector from "../DateSelector";
import PassengerSelector from "../PassengerSelector";
import Modal from "../ui/Modal";

export default function TripSearchModal({
    show,
    type,
    cities,
    loading,
    formData = { departure: null, arrival: null, date: "", passengers: 1 },
    onClose,
    onSelectCity,
    onSelectDate,
    onSelectPassengers
}) {
    const getModalTitle = (type) => {
        switch (type) {
            case "departure":
                return "Choisissez votre départ"

            case "arrival":
                return "Où allez-vous ?"

            case "date":
                return "Date du voyage"

            case "passengers":
                return "Passagers"

            default:
                return ""
        }
    };

    const modalTitle = getModalTitle(type);

    return (
        <Modal
            isOpen={show}
            onClose={onClose}
            title={modalTitle}
        >
            <div className="trip-search-modal">

                {type === "departure" && (
                    <CitySelector
                        cities={cities}
                        loading={loading}
                        onSelect={onSelectCity}
                    />
                )}

                {type === "arrival" && (
                    <CitySelector
                        cities={cities.filter((c) => c.id !== formData.departure?.id)}
                        loading={loading}
                        onSelect={onSelectCity}
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