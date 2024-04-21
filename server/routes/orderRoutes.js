import express from 'express';
import { createOrder, getOrdersByRestaurant, getMessagesByOrderId, getOrderInfo, getOrdersByNGO, declineOrder, acceptOrder, fulfillOrder, cancelOrder, addRestReview, addNgoReview } from '../controllers/orderController.js';

const router = express.Router();

// Create a new order request
router.post('/orders', createOrder);

// Get all orders for a particular restaurant
router.get('/orders/restaurant', getOrdersByRestaurant);

// Get all orders for a particular NGO
router.get('/orders/ngo', getOrdersByNGO);

// Route to get a specific order's information
router.get('/orders/:orderId', getOrderInfo);

// Decline an order request
router.put('/orders/:id/decline', declineOrder);

// Accept an order
router.put('/orders/:id/accept', acceptOrder);

// Cancel an order
router.put('/orders/:id/cancel', cancelOrder);

// Fulfill an order
router.put('/orders/:id/fulfill', fulfillOrder);

// Get chat messages for an order id
router.get('/orders/:orderId/messages', getMessagesByOrderId);

// Add a review for the restaurant
router.post('/addRestReview/:orderId', addRestReview);

// Add a review for the ngo
router.post('/addNgoReview/:orderId', addNgoReview);

export default router;