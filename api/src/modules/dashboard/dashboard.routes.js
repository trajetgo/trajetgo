const express = require("express");

const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");

const controller = require("./dashboard.controller");

const router = express.Router();

router.use(authenticate);

router.get(
    "/companies/summary",
    authorize(
        "COMPANY_ADMIN",
    ),
    controller.getSummary
);


module.exports = router;