const resultController = require("../controllers/result.controllers");
const { verifyToken } = require("../utils/verifyToken");

// Import package
const router = require("express").Router();

// Routes
router.get("/display",verifyToken, resultController.display);
router.get(
  "/school-display/:code",
  verifyToken,
  resultController.school_result_display
);
router.get(
  "/student-display",
  resultController.student_result_display
);
router.patch("/result-update/:id",verifyToken, resultController.result_update);
router.post(
  "/previous-result",
  verifyToken,
  resultController.previous_result
);
router.get("/previous-display", verifyToken, resultController.previous_display);

module.exports = router;
