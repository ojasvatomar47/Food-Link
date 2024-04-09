import express from 'express';
import connectDB from './db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 8800;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Server Connection
app.listen(PORT, () => {
    console.log(`Server is running on PORT => ${PORT}`);
});
