// Import package
const router = require('express').Router();

// Import files
const userController = require('../controllers/user.controllers');
const { verifyToken } = require('../utils/verifyToken');


// Routes
router.post('/signup' , userController.signup);
router.post('/login' , userController.login);
router.post('/forgot-password' , userController.forgot_password);
router.post("/reset-password", userController.reset_password);
router.get("/principal-info", verifyToken, userController.principal_info);

module.exports = router;