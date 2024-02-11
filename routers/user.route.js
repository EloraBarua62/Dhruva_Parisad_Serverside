// Import package
const router = require('express').Router();

// Import files
const userController = require('../controllers/user.controllers')


// Routes
router.post('/signup' , userController.signup);
router.post('/login' , userController.login);

module.exports = router;