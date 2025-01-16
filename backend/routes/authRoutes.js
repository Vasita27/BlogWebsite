const express = require('express');
const { signup, login, home, addBlog } = require('../controllers/authController');
const checkToken = require('../middleware/checkToken');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
