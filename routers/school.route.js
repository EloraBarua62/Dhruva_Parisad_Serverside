// Import package
const router = require("express").Router();

// Import files
const schoolController = require("../controllers/school.controllers");
const { verifyToken } = require("../utils/verifyToken");

// Routes
router.get("/zone-details", schoolController.zone_details);
router.post("/registration", verifyToken, schoolController.registration);
router.get("/display", verifyToken, schoolController.display);
router.get("/details/:zone", verifyToken, schoolController.details);
router.patch("/update-status/:id", verifyToken, schoolController.update_status);
router.delete("/delete-info/:id", verifyToken, schoolController.delete_info);

module.exports = router;
