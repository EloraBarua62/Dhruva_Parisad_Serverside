// Import package
const router = require("express").Router();

// Import files
const schoolController = require("../controllers/school.controllers");
const { verifyToken } = require("../utils/verifyToken");

// Routes
router.get("/zone-details", verifyToken, schoolController.zone_details);
router.post("/registration", verifyToken, schoolController.registration);
router.get("/details/:zone", verifyToken, schoolController.details);
router.patch("/update-status/:id", verifyToken, schoolController.update_status);

module.exports = router;
