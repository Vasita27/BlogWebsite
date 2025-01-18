const Blog = require("../models/Blog");

exports.home = (req, res) => {
  res.json({
    message: "Welcome to the Home Page",
    user: req.user,
  });
};

exports.createBlog = async (req, res) => {

  const { title, content, categories, tags, imageUrl } = req.body;

  // Validate the required fields
  if (!title || !content || !categories || !tags) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  // Create a new blog document and save it to the database
  try {
    const newBlog = new Blog({
      title,
      content,
      categories,
      tags: tags,
      images:imageUrl, // Assuming the image URL is passed from the frontend
      author: req.user.username, // Assuming the user ID is available in `req.user`
    });

    // Save the blog to the database
    const savedBlog = await newBlog.save();



    // Return a response with the saved blog data
    res.status(201).json({
      message: "Blog created successfully!",
      blog: savedBlog,
    });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ error: "Failed to create blog" });
  }
};


// Trending Blogs
exports.getBlogsByOrder = async (req, res) => {
  const { page = 1, limit = 4, order = 'latest' } = req.query; // Default to latest order
  const skip = (page - 1) * limit;

  let sortOrder = {};
  
  // Check the order type and sort accordingly
  if (order === 'trending') {
    sortOrder = { views: -1 ,likes : -1}; // Sort by views in descending order for trending
  } else {
    sortOrder = { createdAt: -1 }; // Sort by creation date for latest
  }

  Blog.find()
    .sort(sortOrder)
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .then((blogs) => {
      Blog.countDocuments().then((totalCount) => {
        res.json({
          blogs,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: parseInt(page),
        });
      });
    })
    .catch((error) => {
      res.json({ error });
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

    // Check if the user has already liked the blog
    const isLiked = blog.likes.includes(userId);
    
    let updatedBlog;

    if (isLiked) {
      // Unlike the blog (decrement likes by 1)
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
      // Like the blog (increment likes by 1)
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the like.",
    });
  }
};



exports.deleteBlog =  (req,res) => {
  Blog.findById(req.params.id).then((blog) => {
    if(blog.author == req.user.username)
    Blog.findByIdAndDelete(req.params.id).then(blog => res.json({blog})).catch(error => res.json({error}))
    else
    return res.json({error:'Your are not the author of this blog'})
  }).catch((error) => {res.json({error})});
}

exports.updateBlog = async (req, res) => {
  try {
    // Destructure values from the request body
    const { title, content, categories, tags, images } = req.body;

    // Find the blog by ID
    const blog = await Blog.findById(req.params.id);

    // Check if the current user is the author of the blog
    if (blog.author === req.user.username) {
      // Update the blog with the new data
      Blog.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            title,
            content,
            ...(categories && { categories }),
            ...(tags && { tags }),
            ...(images && { images }),
            updatedAt: Date.now, // Set the updated timestamp
          },
        },
        { new: true } // Return the updated blog document
      )
        .then((updatedBlog) => {
        
          res.json({ blog: updatedBlog });
        })
        .catch((error) => {
        
          res.json({ error: "Error updating blog", details: error });
        });
    } else {
      // If the current user is not the author
      return res.json({ error: "You are not the author of this blog" });
    }
  } catch (error) {
    console.error(error);
    res.json({ error: "Error occurred while updating the blog", details: error });
  }
};





exports.getBlogs = async (req, res) => {
  try {
    // Get page and limit from query parameters (default to 1 and 2 respectively)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the blogs with status "draft" and pagination
    const blogs = await Blog.find({ status: "draft" })
      .skip(skip)   // Skip the appropriate number of blogs
      .limit(limit) // Limit to the desired number of blogs per page
      .sort({ createdAt: -1 }); // Sort by creation date, descending

    // Fetch total count of "draft" blogs to calculate total pages
    const totalBlogs = await Blog.countDocuments({ status: "draft" });

    // Send back the paginated blogs along with pagination info
    res.json({
      blogs,
      totalBlogs,
      totalPages: Math.ceil(totalBlogs / limit), // Total pages based on the number of blogs and limit
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

exports.manageBlogs = async (req, res) => {
  try {
    const username = req.user.username; // Assuming the user is identified by a username
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page parameter
    const limit = parseInt(req.query.limit) || 5; // Default to 5 blogs per page
    const skip = (page - 1) * limit; // Calculate the number of blogs to skip

    // Find blogs where author matches username, with pagination
    const blogs = await Blog.find({ author: username })
                            .skip(skip)
                            .limit(limit);
    
    // Count total blogs for pagination calculation
    const totalBlogs = await Blog.countDocuments({ author: username });

    res.json({ 
      blogs,
      totalPages: Math.ceil(totalBlogs / limit), // Calculate total pages
      currentPage: page 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

