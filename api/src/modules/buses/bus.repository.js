const prisma = require("../../config/database");
const bookingRepository = require("../bookings/booking.repository");


class BusRepository {
    findMany = async (filters = {}) => {
        const where = {};

        if (filters.companyId) {
            where.companyId = filters.companyId;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        return prisma.bus.findMany({
            where,
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    }
                },
                seatLayout: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    findById = async (id) => {
        return prisma.bus.findUnique({
            where: { id },
            include: {
                company: true
            }
        });
    }

    findByRegistrationNumber = async (companyId, registrationNumber) => {
        return prisma.bus.findUnique({
            where: {
                companyId_registrationNumber: {
                    companyId,
                    registrationNumber
                }
            }
        });
    }

    findCompanyById = async (companyId) => {
        return prisma.company.findUnique({
            where: {
                id: companyId
            }
        });
    }

    create = async (data) => {
        return prisma.bus.create({
            data,
            include: {
                company: true
            }
        });
    }

    update = async (id, data) => {
        return prisma.bus.update({
            where: { id },
            data,
            include: {
                company: true
            }
        });
    }

    upsertSeatLayout = async (busId, data) => {
        const { name, type, rows, columns, aisleAfterColumn, seats } = data;

        return prisma.$transaction(async (tx) => {
            /* ---------- 1. Chercher un layout existant ---------- */

            const existing = await tx.seatLayout.findUnique({
                where: { busId },
                include: { seats: true },
            });

            let layout;

            /* ---------- 2. Créer ou mettre à jour le layout ---------- */

            if (existing) {
                // Vérifier que les sièges modifiés ne sont pas réservés
                const reservedSeatIds = await bookingRepository.getReservedSeatIds(
                    tx,
                    existing.seats.map((s) => s.id)
                );

                layout = await tx.seatLayout.update({
                    where: { id: existing.id },
                    data: {
                        name,
                        type,
                        rows,
                        columns,
                    },
                });

                // Siège à conserver, à mettre à jour, à créer
                const incomingNumbers = new Set(seats.map((s) => s.number));
                const seatMap = new Map(existing.seats.map((s) => [s.number, s]));

                /* 2a. Supprimer les sièges qui ne sont plus là */
                const toDelete = existing.seats.filter(
                    (s) => !incomingNumbers.has(s.number) && !reservedSeatIds.has(s.id)
                );

                if (toDelete.length > 0) {
                    await tx.seat.deleteMany({
                        where: { id: { in: toDelete.map((s) => s.id) } },
                    });
                }

                /* 2b. Créer ou mettre à jour chaque siège */
                for (const seatData of seats) {
                    const existingSeat = seatMap.get(seatData.number);

                    if (existingSeat) {
                        await tx.seat.update({
                            where: { id: existingSeat.id },
                            data: {
                                row: seatData.row,
                                column: seatData.column,
                                position: seatData.position ?? null,
                                status: seatData.status,
                            },
                        });
                    } else {
                        await tx.seat.create({
                            data: {
                                layoutId: layout.id,
                                number: seatData.number,
                                row: seatData.row,
                                column: seatData.column,
                                position: seatData.position ?? null,
                                status: seatData.status,
                            },
                        });
                    }
                }
            } else {
                /* ---------- 3. Créer un nouveau layout complet ---------- */

                layout = await tx.seatLayout.create({
                    data: {
                        busId,
                        name,
                        type,
                        rows,
                        columns,
                        seats: {
                            create: seats.map((s) => ({
                                number: s.number,
                                row: s.row,
                                column: s.column,
                                position: s.position ?? null,
                                status: s.status,
                            })),
                        },
                    },
                });
            }

            /* ---------- 4. Retourner le layout avec ses sièges ---------- */

            return tx.seatLayout.findUnique({
                where: { id: layout.id },
                include: {
                    seats: { orderBy: [{ row: "asc" }, { column: "asc" }] },
                    bus: {
                        select: {
                            id: true,
                            name: true,
                            registrationNumber: true,
                            capacity: true,
                        },
                    },
                },
            });
        });
    };

    findSeatLayout = async (busId) => {
        return await prisma.seatLayout.findUnique({
            where: {
                busId
            },
            include: {
                seats: {
                    select: {
                        id: true,
                        number: true,
                        row: true,
                        column: true,
                        position: true,
                        status: true,
                    },
                    orderBy: [
                        { row: "asc" },
                        { column: "asc" }
                    ],
                }
            }
        })
    }

    findManyByIds = async (ids = []) => {
        if (!ids.length) return [];

        return prisma.bus.findMany({
            where: {
                id: { in: ids },
            },
            include: {
                company: {
                    select: { id: true, name: true, logo: true },
                },
            },
        });
    };
};

module.exports = new BusRepository();