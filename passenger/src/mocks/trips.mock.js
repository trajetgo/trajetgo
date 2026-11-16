import { generateSeatLayout } from './seatLayout.generator';

export const MOCK_TRIPS = [
    {
        id: "trip-001",

        company: {
            id: "company-001",
            name: "UTB",
            logo: require('../imgs/company/utb.png'),
        },

        departure: {
            city: {
                id: "city-abidjan",
                name: "Abidjan",
                slug: "abidjan",
            },
            agency: {
                id: "agency-abidjan-001",
                name: "Gare d'Adjamé",
            },
            time: "06:30",
        },

        arrival: {
            city: {
                id: "city-yamoussoukro",
                name: "Yamoussoukro",
                slug: "yamoussoukro",
            },
            agency: {
                id: "agency-yamoussoukro-001",
                name: "Gare UTB Yamoussoukro",
            },
            time: "10:30",
        },

        date: "2026-10-11",
        duration: "4h00",

        bus: {
            id: "bus-001",
            name: "Car UTB",
            type: "STANDARD",
            seatCount: 50,

            amenities: [
                "AIR_CONDITIONING",
                "USB_CHARGING",
                "LUGGAGE_SPACE",
            ],

            seatLayout: generateSeatLayout({
                type: "2x2",
                rowsCount: 12,
                exitRows: [6],
                randomize: true,
                occupancy: 0.6,
            }),
        },

        availableSeats: 18,
        price: 5000,
        currency: "XOF",
        status: "SCHEDULED",
    },

    {
        id: "trip-002",

        company: {
            id: "company-002",
            name: "SDS Transport",
            logo: require('../imgs/company/sds.png'),
        },

        departure: {
            city: {
                id: "city-abidjan",
                name: "Abidjan",
                slug: "abidjan",
            },
            agency: {
                id: "agency-abidjan-002",
                name: "Adjamé",
            },
            time: "08:00",
        },

        arrival: {
            city: {
                id: "city-yamoussoukro",
                name: "Yamoussoukro",
                slug: "yamoussoukro",
            },
            agency: {
                id: "agency-yamoussoukro-002",
                name: "Gare centrale",
            },
            time: "12:15",
        },

        date: "2026-10-11",
        duration: "4h15",

        bus: {
            id: "bus-002",
            name: "Car Express",
            type: "EXPRESS",
            seatCount: 45,

            amenities: [
                "AIR_CONDITIONING",
                "WIFI",
                "USB_CHARGING",
                "RECLINING_SEATS",
                "LUGGAGE_SPACE",
            ],

            seatLayout: generateSeatLayout({
                type: "2x2",
                rowsCount: 11,
                vipRows: [1, 2],
                exitRows: [5],
                randomize: true,
                occupancy: 0.4,
            }),
        },

        availableSeats: 27,
        price: 6000,
        currency: "XOF",
        status: "SCHEDULED",
    },

    {
        id: "trip-003",

        company: {
            id: "company-003",
            name: "SBTA",
            logo: require('../imgs/company/sbta.png'),
        },

        departure: {
            city: {
                id: "city-abidjan",
                name: "Abidjan",
                slug: "abidjan",
            },
            agency: {
                id: "agency-abidjan-003",
                name: "Yopougon",
            },
            time: "14:00",
        },

        arrival: {
            city: {
                id: "city-yamoussoukro",
                name: "Yamoussoukro",
                slug: "yamoussoukro",
            },
            agency: {
                id: "agency-yamoussoukro-003",
                name: "Gare SBTA",
            },
            time: "18:10",
        },

        date: "2026-10-11",
        duration: "4h10",

        bus: {
            id: "bus-003",
            name: "Bus Confort",
            type: "COMFORT",
            seatCount: 40,

            amenities: [
                "AIR_CONDITIONING",
                "WIFI",
                "USB_CHARGING",
                "POWER_OUTLET",
                "RECLINING_SEATS",
                "READING_LIGHT",
                "LUGGAGE_SPACE",
            ],

            seatLayout: generateSeatLayout({
                type: "2x2",
                rowsCount: 10,
                vipRows: [1, 2, 3],
                randomize: true,
                occupancy: 0.8,
            }),
        },

        availableSeats: 9,
        price: 7000,
        currency: "XOF",
        status: "SCHEDULED",
    },

    {
        id: "trip-004",

        company: {
            id: "company-001",
            name: "UTB",
            logo: require('../imgs/company/utb.png'),
        },

        departure: {
            city: {
                id: "city-yamoussoukro",
                name: "Yamoussoukro",
                slug: "yamoussoukro",
            },
            agency: {
                id: "agency-yamoussoukro-001",
                name: "Gare UTB Yamoussoukro",
            },
            time: "07:00",
        },

        arrival: {
            city: {
                id: "city-abidjan",
                name: "Abidjan",
                slug: "abidjan",
            },
            agency: {
                id: "agency-abidjan-001",
                name: "Gare d'Adjamé",
            },
            time: "11:00",
        },

        date: "2026-10-11",
        duration: "4h00",

        bus: {
            id: "bus-004",
            name: "Car UTB",
            type: "STANDARD",
            seatCount: 50,

            amenities: [
                "AIR_CONDITIONING",
                "LUGGAGE_SPACE",
            ],

            seatLayout: generateSeatLayout({
                type: "2x2",
                rowsCount: 12,
                randomize: true,
                occupancy: 0.55,
            }),
        },

        availableSeats: 21,
        price: 5000,
        currency: "XOF",
        status: "SCHEDULED",
    },

    {
        id: "trip-005",

        company: {
            id: "company-004",
            name: "CA Trans",
            logo: require('../imgs/company/ca-trans.png'),
        },

        departure: {
            city: {
                id: "city-abidjan",
                name: "Abidjan",
                slug: "abidjan",
            },
            agency: {
                id: "agency-abidjan-004",
                name: "Adjamé Transport",
            },
            time: "09:30",
        },

        arrival: {
            city: {
                id: "city-bouake",
                name: "Bouaké",
                slug: "bouake",
            },
            agency: {
                id: "agency-bouake-001",
                name: "Gare centrale de Bouaké",
            },
            time: "15:00",
        },

        date: "2026-10-11",
        duration: "5h30",

        bus: {
            id: "bus-005",
            name: "Express CI",
            type: "EXPRESS",
            seatCount: 50,

            amenities: [
                "AIR_CONDITIONING",
                "WIFI",
                "USB_CHARGING",
                "POWER_OUTLET",
                "LUGGAGE_SPACE",
            ],

            seatLayout: generateSeatLayout({
                type: "2x2",
                rowsCount: 12,
                vipRows: [1],
                exitRows: [6],
                randomize: true,
                occupancy: 0.35,
            }),
        },

        availableSeats: 32,
        price: 7500,
        currency: "XOF",
        status: "SCHEDULED",
    },

    {
        id: "trip-006",

        company: {
            id: "company-005",
            name: "Ocean Transport",
            logo: require('../imgs/company/ocean-transport.png'),
        },

        departure: {
            city: {
                id: "city-abidjan",
                name: "Abidjan",
                slug: "abidjan",
            },
            agency: {
                id: "agency-abidjan-005",
                name: "Gare d'Adjamé",
            },
            time: "16:00",
        },

        arrival: {
            city: {
                id: "city-bouake",
                name: "Bouaké",
                slug: "bouake",
            },
            agency: {
                id: "agency-bouake-002",
                name: "Gare Rayon Voyage",
            },
            time: "21:30",
        },

        date: "2026-10-11",
        duration: "5h30",

        bus: {
            id: "bus-006",
            name: "Confort Plus",
            type: "COMFORT",
            seatCount: 40,

            amenities: [
                "AIR_CONDITIONING",
                "WIFI",
                "USB_CHARGING",
                "POWER_OUTLET",
                "TOILET",
                "TV",
                "RECLINING_SEATS",
                "READING_LIGHT",
                "LUGGAGE_SPACE",
            ],

            seatLayout: generateSeatLayout({
                type: "2x2",
                rowsCount: 10,
                vipRows: [1, 2],
                randomize: true,
                occupancy: 0.65,
            }),
        },

        availableSeats: 14,
        price: 8000,
        currency: "XOF",
        status: "SCHEDULED",
    },
]; 