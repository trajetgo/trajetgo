const express = require('express');
const path = require("path");
const rateLimit = require('express-rate-limit');
const swaggerUi = require("swagger-ui-express");
const debug = require('./middlewares/debug.middleware');
const swaggerDocument = require('./config/swagger');

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard'
});

router.use(limiter);

router.use(debug);

router.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the application!" });
});

router.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
);

router.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

router.use('/v1', require('./routes'));

module.exports = router;