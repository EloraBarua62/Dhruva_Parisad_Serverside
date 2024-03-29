const resultController = require("../controllers/result.controllers");
const { verifyToken } = require("../utils/verifyToken");

// Import package
const router = require("express").Router();

// Import files


// Routes
router.get("/display",verifyToken, resultController.display);
router.get(
  "/specific-display/:code",
  verifyToken,
  resultController.specific_display
);
router.patch("/result-update/:id",verifyToken, resultController.result_update);
// router.get("/details", studentController.details);

module.exports = router;
