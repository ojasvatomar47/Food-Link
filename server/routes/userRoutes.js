import express from 'express';
import { getNGOInfo, getRestaurantInfo } from '../controllers/userController.js';

const router = express.Router();

// Route to get information about a specific NGO by ID
router.get('/ngo/profile/:id', getNGOInfo);

// Route to get information about a specific Restaurant by ID
router.get('/restaurant/profile/:id', getRestaurantInfo);

export default router;
