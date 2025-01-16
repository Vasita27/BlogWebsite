const express = require('express');
const {  home, createBlog } = require('../controllers/appControllers');
const checkToken = require('../middleware/checkToken');


const router = express.Router();


// Protected routes
router.get('/home', checkToken, home); // Accessible by any logged-in user
router.get('/createBlog', checkToken, createBlog); 

module.exports = router;