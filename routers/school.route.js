// Import package
const router = require("express").Router();

// Import files
const schoolController = require("../controllers/school.controllers");

// Routes
router.get("/zone-details", schoolController.zone_details);
// router.get("/details", schoolController.details);

module.exports = router;