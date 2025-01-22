const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const connectDB = require('./config/db');
const path = require("path");

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: "https://blog-website-orpin-chi.vercel.app", // Frontend origin
  credentials: true, // Allow cookies and authentication
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'], // Allows ALL HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow Content-Type and Authorization headers
}));

// Connect to the database
connectDB();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Multer (we'll still use memory storage since Cloudinary handles the file upload)
const storage = multer.memoryStorage(); // Store file in memory temporarily
const upload = multer({ storage: storage });

// Endpoint to upload image to Cloudinary
app.post("/uploadImage", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Upload the file to Cloudinary
  cloudinary.uploader.upload_stream(
    { resource_type: 'image' },
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
      }
      // Send back the image URL from Cloudinary
      res.json({ imageUrl: result.secure_url });
    }
  ).end(req.file.buffer);
});

// Import routes for users and apps
const userRoutes = require('./routes/authRoutes');
app.use('/auth', userRoutes);

const appRoutes = require('./routes/appRoutes');
app.use('/app', appRoutes);

// Root route for testing purposes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
