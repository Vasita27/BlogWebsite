const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const multer = require('multer')
dotenv.config(); // Load environment variables from .env file
const cors = require('cors');
const connectDB = require('./config/db');
const path = require("path")

const app = express();
app.use(express.urlencoded({ extended: true }));
// Configure CORS to allow requests from specified origins
app.use(cors({
  origin: "https://blog-website-orpin-chi.vercel.app", // Frontend origin
  credentials: true, // Allow cookies and authentication
  methods: "*", // Allows ALL HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow Content-Type and Authorization headers
}));
// Middleware to parse incoming JSON requests
app.use(cookieParser());

app.use(express.json());

//connect to database
connectDB();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Specify the folder where images will be stored
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
    },
  });
  const upload = multer({ storage: storage });
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Endpoint to upload image
app.post("/uploadImage", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Construct image URL
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Import userRoutes and attach them to the app
const userRoutes = require('./routes/authRoutes');
app.use('/auth', userRoutes);
const appRoutes = require('./routes/appRoutes');
app.use('/app', appRoutes);

// Root route (optional, for testing purposes)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
