import express from 'express';
import {
    getRestaurantListings,
    createListing,
    updateListing,
    deleteListing,
    getRestaurantsByNGO
} from '../controllers/listingController.js';

const router = express.Router();

// Get listings created by a particular restaurant
router.get('/listings', getRestaurantListings);

// Create a new listing
router.post('/listings', createListing);

// Update a listing
router.put('/listings/:id', updateListing);

// Delete a listing
router.delete('/listings/:id', deleteListing);

// Get restaurants within 15km radius of an NGO with unblocked listings
router.get('/restaurants-by-ngo', getRestaurantsByNGO);

export default router;