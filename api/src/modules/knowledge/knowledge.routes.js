const express = require("express");

const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
// const validate = require("../../middlewares/validate.middleware");
// const validateCsrf = require("../../middlewares/csrf.middleware");

const controller = require("./knowledge.controller");
// const schema = require("./knowledge.validation");

const router = express.Router();

// router.get("/categories", controller.listCategories);
router.get("/articles", controller.listArticles);
router.get("/articles/:slug", controller.getArticleBySlug);
router.post("/articles/:slug/feedback", controller.submitFeedback);
router.get("/search", controller.search);

router.use(authenticate);
router.use(
    authorize(
        "COMPANY_ADMIN",
        "SUPER_ADMIN"
    )
);

/* ---------- Catégories ---------- */

// router.get(
//     "/categories",
//     controller.listCategories
// );
// router.post(
//     "/categories",
//     validateCsrf,
//     validate(schema.createCategory, "body"),
//     controller.createCategory
// );
// router.patch(
//     "/categories/:id",
//     validateCsrf,
//     validate(schema.updateCategory, "body"),
//     controller.updateCategory
// );
// router.delete(
//     "/categories/:id",
//     validateCsrf,
//     controller.deleteCategory
// );

/* ---------- Articles ---------- */

router.get(
    "/articles",
    controller.listArticles
);
// router.get(
//     "/articles/:id",
//     controller.getArticle
// );
// router.post(
//     "/articles",
//     validateCsrf,
//     validate(schema.createArticle, "body"),
//     controller.createArticle
// );
// router.patch(
//     "/articles/:id",
//     validateCsrf,
//     validate(schema.updateArticle, "body"),
//     controller.updateArticle
// );
// router.patch(
//     "/articles/:id/status",
//     validateCsrf,
//     validate(schema.updateStatus, "body"),
//     controller.updateArticleStatus
// );
// router.delete(
//     "/articles/:id",
//     validateCsrf,
//     controller.deleteArticle
// );

module.exports = router;