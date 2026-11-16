const ApiError = require('../../utils/ApiError');
const repository = require('./seatLayout.repository');

class SeatLayoutService {
    getLayoutByBus = async (busId) => {
        const bus = await repository.findBusById(busId);

        if (!bus) {
            throw new ApiError(
                404,
                'Bus introuvable'
            )
        }

        const layout = await repository.findByBusId(busId);

        if (!layout) {
            throw new ApiError(
                404,
                'Aucune configuration de sièges pour ce bus'
            )
        }

        return layout;
    }

    createLayout = async (data) => {
        const {
            busId,
            name,
            type,
            rows,
            columns,
            seats
        } = data;

        const bus = await repository.findBusById(busId);

        if (!bus) {
            throw new ApiError(
                404,
                'Bus introuvable'
            );
        }

        if (bus.status === 'RETIRED') {
            throw new ApiError(
                400,
                'Impossible de configurer un bus retiré'
            );
        }

        const existingLayout =
            await repository.findByBusId(busId);

        if (existingLayout) {
            throw new ApiError(
                409,
                'Ce bus possède déjà une configuration de sièges'
            );
        }

        if (seats.length > bus.capacity) {
            throw new ApiError(
                400,
                `Le nombre de sièges (${seats.length}) dépasse la capacité du bus (${bus.capacity})`
            );
        }

        const numbers = seats.map(
            seat => seat.number
        );

        if (new Set(numbers).size !== numbers.length) {
            throw new ApiError(
                400,
                'Deux sièges possèdent le même numéro'
            );
        }

        const coordinates = seats.map(
            seat => `${seat.row}-${seat.column}`
        );

        if (
            new Set(coordinates).size !==
            coordinates.length
        ) {
            throw new ApiError(
                400,
                'Deux sièges occupent la même position'
            );
        }

        return repository.createLayoutWithSeats(
            {
                busId,
                name,
                type,
                rows,
                columns
            },
            seats
        );
    };

    updateSeatStatus = async (
        seatId,
        status
    ) => {
        const seat =
            await repository.findSeatById(seatId);

        if (!seat) {
            throw new ApiError(
                404,
                'Siège introuvable'
            )
        }

        return repository.updateSeat(
            seatId,
            { status }
        );
    }
};

module.exports = new SeatLayoutService();