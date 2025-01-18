const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');


// Signup controller
exports.signup = async (req, res) => {
    const { username, password, role } = req.body;
  
    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword, role });
      //Save the user
      await newUser.save();
  
      // Create a JWT token
      const token = jwt.sign(
        { userId: newUser._id, username: newUser.username, role: newUser.role },
        process.env.JWT_SECRET, // secret key in environment variable
        { expiresIn: '1h' } // Token expiry time (optional)
      );
  
      // Send the token in the response along with a success message
      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error("Error occurred during signup:", error);
      res.status(500).json({ message: 'Error registering user', error });
    }
  };

// Login controller
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    //Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('user', token, {
      httpOnly: true, 
      maxAge: 3600000, 
      secure: false
  }).json({ message: 'Login successful', token });
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).json({ message: 'Error during login', error });
  }
};

