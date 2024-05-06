import Listing from '../models/Listing.js';
import User from '../models/User.js';
import geolib from 'geolib';

// Get listings created by a particular restaurant
export const getRestaurantListings = async (req, res) => {
    try {
        // Fetch listings that are not expired
        const { restaurantId } = req.params;
        const listings = await Listing.find({ restaurantId: restaurantId, expiresAt: { $gte: new Date() } });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error });
    }
};

// Create a new listing
export const createListing = async (req, res) => {
    const { name, quantity, expiry, view, restaurantId } = req.body;

    const newListing = new Listing({
        name,
        quantity,
        expiry,
        view,
        restaurantId
    });

    try {
        const savedListing = await newListing.save();
        res.status(201).json(savedListing);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update a listing
export const updateListing = async (req, res) => {
    const { id } = req.params;
    const { name, quantity, expiry } = req.body;

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { name, quantity, expiry },
            { new: true }
        );

        if (!updatedListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.json(updatedListing);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a listing
export const deleteListing = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedListing = await Listing.findByIdAndDelete(id);

        if (!deletedListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // Distance in km
};

export const getNearbyListings = async (req, res) => {
    try {
        let { latitude, longitude, ngoId } = req.query;

        // Convert latitude and longitude to numbers
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);

        const ngo = await User.findById(ngoId);
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        // Fetch all not blocked listings with restaurant details
        const listings = await Listing.find({ view: 'not blocked' })
            .populate('restaurantId', 'username latitude longitude');

        // Filter nearby listings
        const nearbyListings = listings.filter((listing) => {
            const restaurant = listing.restaurantId;
            if (!restaurant || !restaurant.latitude || !restaurant.longitude) {
                return false; // Skip if restaurant details are missing
            }

            const distance = calculateDistance(
                latitude,
                longitude,
                restaurant.latitude,
                restaurant.longitude
            );

            // console.log(distance);

            return distance <= 15; // Filter listings within 15km radius
        });

        // Prepare result
        const result = nearbyListings.map((listing) => ({
            name: listing.name,
            listingId: listing._id,
            restaurantId: listing.restaurantId._id,
            restaurantName: listing.restaurantId.username,
            quantity: listing.quantity,
            expiry: listing.expiry,
        }));

        // console.log(result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching nearby listings:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};