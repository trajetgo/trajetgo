const express = require("express");

const controller = require("./tgtl.controller");
const importController = require("./import/import.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const upload = require("../../config/multer");
const validateCsrf = require("../../middlewares/csrf.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/status", 
    authorize("COMPANY_ADMIN"), 
    controller.getStatus
);

router.post(
    "/import/analyze",
    authorize("COMPANY_ADMIN"),
    upload.single("file"),
    importController.analyze
);

router.post(
    "/import/confirm",
    authorize("COMPANY_ADMIN"),
    upload.single("file"),
    importController.confirm
);


module.exports = router;