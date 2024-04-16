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
        res.status(500).json({ message: 'Server Error' });
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
        res.status(500).json({ message: 'Server Error' });
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

export const getRestaurantsByNGO = async (req, res) => {
    const { latitude, longitude } = req.user; // Assuming req.user contains NGO's latitude and longitude

    try {
        const restaurants = await User.find({ userType: 'Restaurant' });

        const restaurantsWithinRadius = restaurants.filter((restaurant) => {
            const distance = geolib.getDistance(
                { latitude: restaurant.latitude, longitude: restaurant.longitude },
                { latitude, longitude }
            );

            // Convert distance to kilometers
            const distanceInKm = distance / 1000;

            return distanceInKm <= 15; // Check if distance is within 15km radius
        });

        res.json(restaurantsWithinRadius);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};