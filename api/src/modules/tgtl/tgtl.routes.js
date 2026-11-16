const express = require("express");

const controller = require("./import/import.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const upload = require("../../config/multer");
const validateCsrf = require("../../middlewares/csrf.middleware");

const router = express.Router();

router.use(authenticate);

router.post(
    "/import/analyze",
    authorize("COMPANY_ADMIN"),
    upload.single("file"),
    controller.analyze
);

router.post(
    "/import/confirm",
    authorize("COMPANY_ADMIN"),
    upload.single("file"),
    controller.confirm
);


module.exports = router;