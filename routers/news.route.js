// Import package
const router = require("express").Router();

// Import files
const newsController = require("../controllers/news.controllers");

// Routes
router.post("/publish", newsController.publish);
// router.get("/details", newsController.details);

module.exports = router;
