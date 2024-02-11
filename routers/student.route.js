// Import package
const router = require("express").Router();

// Import files
const studentController = require("../controllers/student.controllers");

// Routes
router.post("/registration", studentController.registration);
router.get("/details", studentController.details);

module.exports = router;
