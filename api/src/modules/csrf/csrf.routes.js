const express = require('express');
const { generateCsrfToken } = require('../../utils/tokens');

const router = express.Router();

router.get('/token', generateCsrfToken);

module.exports = router;