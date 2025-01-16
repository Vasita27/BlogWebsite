// Middleware to check if the user has the required role
// This is not used yet , we can use it if necessary for other things. contentCreator logic is handled in frontend.
const checkRole = (requiredRole) => (req, res, next) => {
    const { user } = req;
  
    if (user && user.role === requiredRole) {
      next(); // User has the required role
    } else {
      res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
    }
  };
  
  module.exports = checkRole;
  