const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Signup controller
exports.signup = async (req, res) => {
  const { username, email,password, role } = req.body;
  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email,password: hashedPassword, role });

    // Save user
    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set cookie with the token
    res.cookie('user', token, {
      httpOnly: true, // Keep true to prevent client-side JS access (security best practice)
      secure: true, // Set true for HTTPS (required in production)
      sameSite: 'None', // Required for cross-origin cookies
      maxAge: 3600000 // 1 hour expiry
    });
    

    // Send response
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
      httpOnly: true, // Keep true to prevent client-side JS access (security best practice)
      secure: true, // Set true for HTTPS (required in production)
      sameSite: 'None', // Required for cross-origin cookies
      maxAge: 3600000 // 1 hour expiry
    }).json({ message: 'Login successful', token });
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).json({ message: 'Error during login', error });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Generate a token for password reset
      const token = crypto.randomBytes(20).toString('hex');
      user.resetToken = token;
      user.tokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
      await user.save();
      // Send email with reset link
      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.SENDER_MAIL,
              pass: process.env.SENDER_PASS,
          },
      });
      const mailOptions = {
          to: user.email,
          from: process.env.SENDER_MAIL,
          subject: 'Password Reset',
          text: `Click the link to reset your password: https://blog-website-orpin-chi.vercel.app/reset-password/${token}`,
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: 'Password reset link sent to email' });
  } catch (error) {
    console.error("Error occurred during forgot password:", error);
      res.status(500).json({ message: 'Server error' });
  }
}

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
      const user = await User.findOne({ resetToken: token, tokenExpiration: { $gt: Date.now() } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' })};

      user.password = await bcrypt.hash(password, 10); 
      user.resetToken = undefined;
      user.tokenExpiration = undefined;
      await user.save();

      res.json({ message: 'Password has been reset' });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
}