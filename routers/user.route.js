// Import package
const router = require('express').Router();

// Import files
const userController = require('../controllers/user.controllers')


// Routes
router.post('/signup' , userController.signup);

module.exports = router;