
const {
    prisma,
    logSeed,
    logSuccess
} = require('./helpers');

/*
 * Génère les lettres des colonnes.
 *
 * Exemple :
 *
 * 4 colonnes → A B C D
 * 3 colonnes → A B C
 */
const getColumnLetter = (column) => {
    return String.fromCharCode(65 + column);
};

/*
 * Génère les sièges d'un layout.
 *
 * Exemple TWO_PLUS_TWO :
 *
 * 01A 01B 01C 01D
 * 02A 02B 02C 02D
 * ...
 */
const generateSeats = (rows, columns) => {
    const seats = [];

    for (let row = 1; row <= rows; row++) {
        for (let column = 0; column < columns; column++) {
            const letter = getColumnLetter(column);

            let position = 'MIDDLE';

            /*
             * Pour une rangée de 4 sièges :
             *
             * A = fenêtre
             * B = couloir
             * C = couloir
             * D = fenêtre
             */
            if (columns === 4) {
                if (column === 0 || column === 3) {
                    position = 'WINDOW';
                } else {
                    position = 'AISLE';
                }
            }

            /*
             * Pour une rangée de 3 sièges :
             *
             * A = fenêtre
             * B = couloir
             * C = fenêtre
             */
            if (columns === 3) {
                if (column === 0 || column === 2) {
                    position = 'WINDOW';
                } else {
                    position = 'AISLE';
                }
            }

            seats.push({
                number: `${String(row).padStart(2, '0')}${letter}`,
                row,
                column,
                position,
                status: 'ACTIVE'
            });
        }
    }

    return seats;
};

/*
 * Calcule le nombre de rangées nécessaire.
 *
 * Exemple :
 *
 * 50 places / 4 colonnes = 12.5
 * → 13 rangées
 *
 * La dernière rangée sera ensuite limitée
 * au nombre exact de places du bus.
 */
const getRows = (capacity, columns) => {
    return Math.ceil(capacity / columns);
};

const seedSeatLayouts = async (buses) => {
    logSeed('Seed seat layouts');

    /*
     * Configuration des bus.
     *
     * On peut facilement changer le type
     * de disposition pour un bus particulier.
     */
    const layoutsData = [
        {
            key: 'UTB_001',
            bus: buses.UTB_001,
            name: 'Configuration standard 2+2',
            type: 'TWO_PLUS_TWO',
            columns: 4
        },

        {
            key: 'UTB_002',
            bus: buses.UTB_002,
            name: 'Configuration standard 2+2',
            type: 'TWO_PLUS_TWO',
            columns: 4
        },

        {
            key: 'UTB_003',
            bus: buses.UTB_003,
            name: 'Configuration grand bus 2+2',
            type: 'TWO_PLUS_TWO',
            columns: 4
        },

        {
            key: 'STC_001',
            bus: buses.STC_001,
            name: 'Configuration standard 2+2',
            type: 'TWO_PLUS_TWO',
            columns: 4
        },

        {
            key: 'STC_002',
            bus: buses.STC_002,
            name: 'Configuration standard 2+2',
            type: 'TWO_PLUS_TWO',
            columns: 4
        }
    ];

    const layouts = {};

    for (const data of layoutsData) {
        if (!data.bus) {
            throw new Error(
                `Bus ${data.key} introuvable. Vérifiez le seed des buses.`
            );
        }

        const rows = getRows(
            data.bus.capacity,
            data.columns
        );

        /*
         * On crée ou récupère le SeatLayout.
         *
         * Un bus possède un seul layout grâce à :
         *
         * @@unique([busId])
         */
        let layout = await prisma.seatLayout.findUnique({
            where: {
                busId: data.bus.id
            }
        });

        if (!layout) {
            layout = await prisma.seatLayout.create({
                data: {
                    busId: data.bus.id,
                    name: data.name,
                    type: data.type,
                    rows,
                    columns: data.columns
                }
            });
        } else {
            layout = await prisma.seatLayout.update({
                where: {
                    id: layout.id
                },
                data: {
                    name: data.name,
                    type: data.type,
                    rows,
                    columns: data.columns
                }
            });
        }

        /*
         * Récupération des sièges existants.
         */
        const existingSeats = await prisma.seat.findMany({
            where: {
                layoutId: layout.id
            }
        });

        const existingSeatNumbers = new Set(
            existingSeats.map((seat) => seat.number)
        );

        /*
         * Génération des sièges.
         */
        const generatedSeats = generateSeats(
            rows,
            data.columns
        );

        /*
         * Le nombre de sièges générés peut être supérieur
         * à la capacité réelle du bus sur la dernière rangée.
         *
         * Exemple :
         *
         * capacité = 50
         * 13 rangées × 4 = 52
         *
         * On garde donc uniquement les 50 premiers.
         */
        const seatsToCreate = generatedSeats
            .slice(0, data.bus.capacity)
            .filter(
                (seat) => !existingSeatNumbers.has(seat.number)
            );

        if (seatsToCreate.length > 0) {
            await prisma.seat.createMany({
                data: seatsToCreate.map((seat) => ({
                    layoutId: layout.id,
                    number: seat.number,
                    row: seat.row,
                    column: seat.column,
                    position: seat.position,
                    status: seat.status
                }))
            });
        }

        /*
         * Désactive les sièges qui ne font plus partie
         * de la capacité actuelle du bus.
         *
         * Exemple :
         *
         * ancien bus = 52 places
         * nouveau bus = 50 places
         *
         * 13C et 13D deviennent INACTIVE.
         */
        const validSeatNumbers = new Set(
            generatedSeats
                .slice(0, data.bus.capacity)
                .map((seat) => seat.number)
        );

        const seatsToDeactivate = existingSeats.filter(
            (seat) => !validSeatNumbers.has(seat.number)
        );

        for (const seat of seatsToDeactivate) {
            await prisma.seat.update({
                where: {
                    id: seat.id
                },
                data: {
                    status: 'INACTIVE'
                }
            });
        }

        /*
         * Récupération finale.
         */
        const finalLayout = await prisma.seatLayout.findUnique({
            where: {
                id: layout.id
            },
            include: {
                bus: true,
                seats: {
                    orderBy: [
                        {
                            row: 'asc'
                        },
                        {
                            column: 'asc'
                        }
                    ]
                }
            }
        });

        layouts[data.key] = finalLayout;

        const activeSeats = finalLayout.seats.filter(
            (seat) => seat.status === 'ACTIVE'
        ).length;

        logSuccess(
            `${data.bus.name} → ` +
            `${activeSeats} sièges actifs → ` +
            `${data.type}`
        );
    }

    return layouts;
};

module.exports = seedSeatLayouts;