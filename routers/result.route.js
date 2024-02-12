const resultController = require("../controllers/result.controllers");

// Import package
const router = require("express").Router();

// Import files


// Routes
router.get("/display", resultController.display);
// router.get("/details", studentController.details);

module.exports = router;
