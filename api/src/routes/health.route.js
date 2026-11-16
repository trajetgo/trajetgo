const express = require('express');
const env = require('../config/env');
const { getLastRun } = require('../cron/generateTrips');

const router = express.Router();

// Health check
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Trajet Go API Gateway is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.nodeEnv
    });
});

router.get("/cron", (req, res) => {
    res.json(getLastRun());
});

module.exports = router;