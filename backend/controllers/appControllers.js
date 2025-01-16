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
  res.json({
    message: 'Blog created',
    user: req.user,
  });
};