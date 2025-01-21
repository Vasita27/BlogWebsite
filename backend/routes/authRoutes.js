const express = require('express');
const { signup, login, home, addBlog ,forgotPassword,resetPassword} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Route to reset the password
router.post('/reset-password/:token', resetPassword);

module.exports = router;
