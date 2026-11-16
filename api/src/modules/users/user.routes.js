const express = require("express");
const controller = require("./user.controller");
const schema = require("./user.validation");

const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const validateCsrf = require("../../middlewares/csrf.middleware");
const validate = require("../../middlewares/validate.middleware");

const router = express.Router();

/* =========================================================
   1. Auth globale
========================================================= */

router.use(authenticate);

/* =========================================================
   2. List
========================================================= */

router.get(
    "/",
    authorize(
        "SUPER_ADMIN",
        "COMPANY_ADMIN",
        "AGENCY_AGENT"
    ),
    validate(schema.list, "query"),
    controller.getUsers
);

/* =========================================================
   3. Status
========================================================= */

router.patch(
    "/:id/status",
    authorize(
        "SUPER_ADMIN",
        "COMPANY_ADMIN",
        "AGENCY_AGENT"
    ),
    validateCsrf,
    validate(schema.idParam, "params"),
    validate(schema.status, "body"),
    controller.updateStatus
);

/* =========================================================
   4. Role
========================================================= */

router.patch(
    "/:id/role",
    authorize(
        "SUPER_ADMIN",
        "COMPANY_ADMIN",
        "AGENCY_AGENT"
    ),
    validateCsrf,
    validate(schema.idParam, "params"),
    validate(schema.role, "body"),
    controller.updateRole
);

router.post(
    "/invite",
    authorize(
        "SUPER_ADMIN",
        "COMPANY_ADMIN",
        "AGENCY_AGENT"
    ),
    validateCsrf,
    validate(schema.invite, "body"),
    controller.inviteUser
);

router.patch(
    "/me",
    authorize("PASSENGER"),
    controller.updateProfile
)

router.get(
    "/me/sessions",
    controller.getSessions
)

module.exports = router;