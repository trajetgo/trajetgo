const express = require('express');
const { errorHandler, notFound } = require('../utils/errorHandler');

const router = express.Router();


router.use(
    '/health',
    require('./health.route')
);

router.use(
    "/csrf",
    require('../modules/csrf/csrf.routes')
);

router.use(
    "/auth",
    require('../modules/auth/auth.routes')
);

router.use(
    "/locations",
    require('../modules/locations/location.routes')
);

router.use(
    "/routes",
    require('../modules/routes/route.routes')
);

router.use(
    "/trips",
    require('../modules/trips/trip.routes')
);

router.use(
    "/schedules",
    require('../modules/schedules/schedule.routes')
);

router.use(
    "/buses",
    require('../modules/buses/bus.routes')
);

router.use(
    "/seat-layouts",
    require('../modules/seats/seatLayout.routes')
);

router.use(
    '/companies',
    require('../modules/companies/company.routes')
);

router.use(
    '/agencies',
    require('../modules/agencies/agency.routes')
);

router.use(
    "/bookings",
    require('../modules/bookings/booking.routes')
);

router.use(
    "/payments",
    require('../modules/payments/payment.routes')
);

router.use(
    "/tickets",
    require('../modules/tickets/ticket.routes')
);

router.use(
    "/boarding",
    require('../modules/boarding/boarding.routes')
);

router.use(
    "/notifications",
    require('../modules/notifications/notification.routes')
);

router.use(
    "/users",
    require('../modules/users/user.routes')
);

router.use(
    "/tgtl",
    require("../modules/tgtl/tgtl.routes")
);


// Error handling
router.use(notFound);
router.use(errorHandler);


module.exports = router;