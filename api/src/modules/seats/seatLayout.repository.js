const prisma = require("../../config/database");


class SeatLayoutRepository {
    findByBusId = async (busId) => {
        return prisma.seatLayout.findUnique({
            where: {
                busId
            },
            include: {
                seats: {
                    orderBy: [
                        { row: 'asc' },
                        { column: 'asc' }
                    ]
                },
                bus: true
            }
        });
    }

    findById = async (id) => {
        return prisma.seatLayout.findUnique({
            where: {
                id
            },
            include: {
                seats: {
                    orderBy: [
                        { row: 'asc' },
                        { column: 'asc' }
                    ]
                },
                bus: true
            }
        });
    }

    findBusById = async (busId) => {
        return prisma.bus.findUnique({
            where: {
                id: busId
            }
        });
    }

    createLayoutWithSeats = async (
        layoutData,
        seats
    ) => {
        return prisma.$transaction(async (tx) => {
            const layout = await tx.seatLayout.create({
                data: layoutData
            });

            await tx.seat.createMany({
                data: seats.map(seat => ({
                    ...seat,
                    layoutId: layout.id
                }))
            });

            return tx.seatLayout.findUnique({
                where: {
                    id: layout.id
                },
                include: {
                    seats: {
                        orderBy: [
                            { row: 'asc' },
                            { column: 'asc' }
                        ]
                    }
                }
            });
        });
    }

    updateLayout = async (id, data) => {
        return prisma.seatLayout.update({
            where: {
                id
            },
            data,
            include: {
                seats: true
            }
        });
    }

    updateSeat = async (id, data) => {
        return prisma.seat.update({
            where: {
                id
            },
            data
        });
    }

    findSeatById = async (id) => {
        return prisma.seat.findUnique({
            where: {
                id
            },
            include: {
                layout: true
            }
        });
    }
};

module.exports = new SeatLayoutRepository();