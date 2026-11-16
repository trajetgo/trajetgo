export const PAYMENT_METHODS = [
    {
        value: "ORANGE_MONEY",
        label: "Orange Money",
        icon: "orange",
        requiresPhone: true,
    },
    {
        value: "MTN_MOMO",
        label: "MTN MoMo",
        icon: "mtn",
        requiresPhone: true,
    },
    {
        value: "MOOV_MONEY",
        label: "Moov Money",
        icon: "moov",
        requiresPhone: true,
    },
    {
        value: "WAVE",
        label: "Wave",
        icon: "wave",
        requiresPhone: true,
    },
    {
        value: "CARD",
        label: "Carte bancaire",
        icon: "card",
        requiresPhone: false,
    },
];

export const GENDER_OPTIONS = [
    { value: "MALE", label: "Homme" },
    { value: "FEMALE", label: "Femme" },
];

export const DOCUMENT_OPTIONS = [
    { value: "ID_CARD", label: "Carte d'identité" },
    { value: "PASSPORT", label: "Passeport" },
    { value: "DRIVER_LICENSE", label: "Permis de conduire" },
];


/**
 * Parse les query params du cart de façon safe.
 *
 * @param {URLSearchParams} searchParams
 * @returns {object}
 */
export function parseCartParams(searchParams) {
    const tripId = searchParams.get("tripId") ?? null;
    const from = searchParams.get("from") ?? null;
    const to = searchParams.get("to") ?? null;
    const date = searchParams.get("date") ?? null;

    const adults = Math.max(
        1,
        Number.parseInt(searchParams.get("adults"), 10) || 1
    );

    const children = (searchParams.get("children") || "")
        .split(",")
        .filter(Boolean)
        .map((v) => Number.parseInt(v, 10))
        .filter(Number.isFinite);

    const seatIds = (searchParams.get("seats") || "")
        .split(",")
        .filter(Boolean);

    const seatNumbers = (searchParams.get("seatNumbers") || "")
        .split(",")
        .filter(Boolean);

    const totalPrice = Number.parseFloat(
        searchParams.get("totalPrice")
    ) || 0;

    const isValid =
        Boolean(tripId) &&
        Boolean(date) &&
        seatIds.length > 0 &&
        seatIds.length === adults + children.length;

    return {
        tripId,
        from,
        to,
        date,
        adults,
        children,
        seatIds,
        seatNumbers,
        totalPrice,
        totalPassengers: adults + children.length,
        isValid,
    };
}

/**
 * Construit la liste initiale de passagers à partir du cart.
 */
export function buildInitialPassengers(cart) {
    return cart.seatIds.map((seatId, index) => {
        const isAdult = index < cart.adults;
        const childIndex = index - cart.adults;

        return {
            id: `p-${seatId}`,
            seatId,
            seatNumber: cart.seatNumbers[index] ?? `#${index + 1}`,
            type: isAdult ? "ADULT" : "CHILD",
            age: isAdult ? null : cart.children[childIndex] ?? null,
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
        };
    });
}