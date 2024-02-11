// Import package
const router = require("express").Router();

// Import files
const studentController = require("../controllers/student.controllers");

// Routes
router.post("/registration", studentController.registration);
// router.post("/login", studentController.login);

module.exports = router;
