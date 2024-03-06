const newsControllers = require("../controllers/news.controllers");

// Import package
const router = require("express").Router();


// Routes
router.post("/publish", newsControllers.publish);
router.get("/all-news", newsControllers.all_news);

module.exports = router;
