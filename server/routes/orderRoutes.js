import express from 'express';
import { createOrder, getOrdersByRestaurant, getOrdersByNGO, declineOrder, acceptOrder, fulfillOrder, cancelOrder } from '../controllers/orderController.js';

const router = express.Router();

// Create a new order request
router.post('/orders', createOrder);

// Get all orders for a particular restaurant
router.get('/orders/restaurant', getOrdersByRestaurant);

// Get all orders for a particular NGO
router.get('/orders/ngo', getOrdersByNGO);

// Decline an order request
router.put('/orders/:id/decline', declineOrder);

// Accept an order
router.put('/orders/:id/accept', acceptOrder);

// Cancel an order
router.put('/orders/:id/cancel', cancelOrder);

// Fulfill an order
router.put('/orders/:id/fulfill', fulfillOrder);

export default router;