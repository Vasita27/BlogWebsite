const express = require('express');
const {  home, addBlog } = require('../controllers/authController');
const checkToken = require('../middleware/checkToken');


const router = express.Router();


// Protected routes
router.get('/home', checkToken, home); // Accessible by any logged-in user
router.get('/addblog', checkToken, addBlog); // Accessible by content creators only {logic of contentCreators handled in frontend}

module.exports = router;