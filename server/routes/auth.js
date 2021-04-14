const express = require('express');
const router = express.Router();


// controllers
const authController = require('../controllers/auth');



router.post('/sign-up', authController.signUp);
router.post('/login', authController.login);



module.exports = router;