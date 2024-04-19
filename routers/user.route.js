// Import package
const router = require('express').Router();

// Import files
const userController = require('../controllers/user.controllers')


// Routes
router.post('/signup' , userController.signup);
router.post('/login' , userController.login);
router.post('/forgot-password' , userController.forgot_password);
router.patch("/reset-password/:token", userController.reset_password);

module.exports = router;