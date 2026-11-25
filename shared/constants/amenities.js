import { Armchair, Lightbulb, Luggage, Plug, Snowflake, Toilet, Tv, Usb, Wifi } from "lucide-react";

export const AMENITIES = {
    AIR_CONDITIONING: {
        label: "Climatisation",
        icon: Snowflake,
    },

    WIFI: {
        label: "Wi-Fi",
        icon: Wifi,
    },

    USB_CHARGING: {
        label: "Prises USB",
        icon: Usb,
    },

    POWER_OUTLET: {
        label: "Prises électriques",
        icon: Plug,
    },

    TOILET: {
        label: "Toilettes",
        icon: Toilet,
    },

    TV: {
        label: "TV",
        icon: Tv,
    },

    RECLINING_SEATS: {
        label: "Sièges inclinables",
        icon: Armchair,
    },

    READING_LIGHT: {
        label: "Lampe de lecture",
        icon: Lightbulb,
    },

    LUGGAGE_SPACE: {
        label: "Espace bagages",
        icon: Luggage,
    },
};

export function getAmenityConfig(amenity) {
    return AMENITIES[amenity] || { icon: null, label: amenity }
}