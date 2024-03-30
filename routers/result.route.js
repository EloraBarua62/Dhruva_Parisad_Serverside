const resultController = require("../controllers/result.controllers");
const { verifyToken } = require("../utils/verifyToken");

// Import package
const router = require("express").Router();

// Import files


// Routes
router.get("/display",verifyToken, resultController.display);
router.get(
  "/school-display/:code",
  verifyToken,
  resultController.school_result_display
);
router.get(
  "/student-display/:roll",
  verifyToken,
  resultController.student_result_display
);
router.patch("/result-update/:id",verifyToken, resultController.result_update);
// router.get("/details", studentController.details);

module.exports = router;
