// Import package
const router = require("express").Router();

// Import files
const studentController = require("../controllers/student.controllers");
const { verifyToken } = require("../utils/verifyToken");

// Routes
router.post("/new-registration",verifyToken, studentController.new_registration);
router.patch("/previous-registration/:roll",verifyToken, studentController.previous_registration);
router.patch("/update-info/:id", verifyToken, studentController.update_info);
router.delete("/delete-info/:id", verifyToken, studentController.delete_info);
router.get("/details",verifyToken, studentController.details);

module.exports = router;
