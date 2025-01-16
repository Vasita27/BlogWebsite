const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();

// Configure CORS to allow requests from specified origins
app.use(cors({ 
    origin: ["http://localhost:3000"], //Will Update with the frontend's origin after hosting
    credentials: true // Allow cookies and credentials to be sent
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

//connect to database
connectDB();

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
