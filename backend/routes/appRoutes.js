const express = require('express');
const {  home, createBlog , trendingBlog ,getBlog, updatedLike, updateBlog, deleteBlog, latestBlog , getBlogsByOrder,manageBlogs} = require('../controllers/appControllers');
const checkToken = require('../middleware/checkToken');


const router = express.Router();


// Protected routes
router.get('/home', checkToken, home); // Accessible by any logged-in user
router.post('/createBlog', checkToken, createBlog); //{title,content,categories,tags,images}
router.get('/manageblogs',checkToken,manageBlogs)
router.get('/getBlog/:id',checkToken,getBlog);
router.patch('/updateLike/:id',checkToken,updatedLike)
router.patch('/updateBlog/:id',checkToken,updateBlog) //{title,content,categories,tags,images}
router.post('/like/:id', checkToken,updatedLike);
router.delete('/deleteBlog/:id',checkToken,deleteBlog);
router.get('/getBlogs',checkToken,getBlogsByOrder)

module.exports = router;