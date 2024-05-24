const newsControllers = require("../controllers/news.controllers");
const { verifyToken } = require("../utils/verifyToken");

// Import package
const router = require("express").Router();


// Routes
router.post("/publish", newsControllers.publish);
router.get("/all-news", newsControllers.all_news);
router.get("/admin-display",verifyToken, newsControllers.admin_display);
router.patch("/update-info/:id", verifyToken, newsControllers.update_info);
router.delete("/delete-info/:id", verifyToken, newsControllers.delete_info);
router.patch("/exam-result", verifyToken, newsControllers.exam_result);


module.exports = router;
