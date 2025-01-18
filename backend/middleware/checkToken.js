const jwt = require('jsonwebtoken');

// Secret key for JWT (in .env)
const SECRET_KEY = process.env.JWT_SECRET || 'privatekey';

// Middleware to check the token
const checkToken = (req, res, next) => {
  //Check headers
  const token = req.cookies.user;
 
  if (token) {
    //format the header to compare

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
      }
      req.user = decoded; // Attach decoded user info (e.g., role, id, username) to the request
      next();
    });
  } else {
    res.status(403).json({ message: 'Forbidden: No token provided' });
  }
};

module.exports = checkToken;
