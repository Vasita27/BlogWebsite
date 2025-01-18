const Blog = require("../models/Blog");

exports.home = (req, res) => {
    console.log(req.user)
  res.json({
    message: 'Welcome to the Home Page',
    user: req.user,
  });
};

// Add Blog page controller (for content creators) - This is not used currently as contentCreator is handled in frontend
exports.createBlog = (req, res) => {
//Logic to save blogs and return a response needs be written here.
  const {title,content,categories,tags,images} = req.body;
  Blog.create(
    {
      title,
      content,
      author:req.user.id,
      categories,
      tags:tags || [],
      images:images || []})
    .then((blog) => {
      res.json({
      message: 'Blog created',
      blog: blog,
      })})
    .catch((error) => {
      res.json({error});
});
};

exports.latestBlog = (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((blogs) => {
      res.status(200).json({ success: true, blogs }); // Use a standardized response structure
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: "Failed to fetch blogs", error });
    });
};


exports.getBlog = async (req,res) => {
try {
const id = req.params.id;
const updatedBlog = await Blog.findOneAndUpdate(
  { _id: id },        
  { $inc: { views: 1 } }, 
  { new: true }         
);
res.json({blog:updatedBlog});
} catch (error) {
  res.json({
  error
  })
}
}

exports.updatedLike = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  try {
    // Fetch the blog by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const isLiked = blog.likes.includes(userId);
    let updatedBlog;

    if (isLiked) {
      // Unlike the blog
      updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { $pull: { likes: userId } },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        updatedBlog,
        message: "Blog unliked successfully.",
      });
    } else {
      // Like the blog
      updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { $push: { likes: userId } },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        updatedBlog,
        message: "Blog liked successfully.",
      });
    }
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the like.",
    });
  }
};

exports.deleteBlog =  (req,res) => {

  Blog.findById(req.params.id).then((blog) => {
    if(blog.author == req.user.id)
    Blog.findByIdAndDelete(req.params.id).then(blog => res.json({blog})).catch(error => res.json({error}))
    else
    return res.json({error:'Your are not the author of this blog'})
  }).catch((error) => {res.json({error})});
}

exports.updateBlog = async (req,res) => {
  try{
  const {title,content,categories,tags,images} = req.body;

  const blog = await Blog.findById(req.params.id);

    if(blog.author == req.user.id)
    Blog.findByIdAndUpdate(
  req.params.id,
  {$set:
    {
     title,content,
     ...(categories && {categories}),
     ...(tags && {tags}),
     ...(images && {images}),
     updatedAt:Date.now
    }},
  {new:true}).then(blog => res.json({blog})).catch(error => res.json({error}))
    else
    return res.json({error:'Your are not the author of this blog'})
}catch(error){ 
res.json({error})
}
}

exports.trendingBlog = (req,res) => {
  Blog.find().sort({ views: -1 }).then((blogs) => {res.json({blogs})}).catch((error) => {res.json({error})});
}