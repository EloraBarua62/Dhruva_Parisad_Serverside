// Import package
const router = require("express").Router();

// Import files
const studentController = require("../controllers/student.controllers");
const { verifyToken } = require("../utils/verifyToken");

// Routes
router.post("/registration",verifyToken, studentController.registration);
router.get("/details",verifyToken, studentController.details);

module.exports = router;
