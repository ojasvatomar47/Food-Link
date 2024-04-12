import express from 'express';
import connectDB from './db.js';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 8800;

// Routes import
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// CORS Middleware
app.use(cors({
    origin: 'http://localhost:5173',  // Allow requests from port 5173
    credentials: true,  // Allow cookies to be sent and received cross-domain
}));

// Routes
app.use('/api', authRoutes);
app.use('/api', listingRoutes);
app.use('/api', orderRoutes);

// Server Connection
app.listen(PORT, () => {
    console.log(`Server is running on PORT => ${PORT}`);
});
