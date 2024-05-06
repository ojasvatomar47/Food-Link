import User from '../models/User.js';
import Order from '../models/Order.js';

// Controller function to get information about a specific NGO by ID
export const getNGOInfo = async (req, res) => {
    try {
        const ngo = await User.findById(req.params.id);
        if (!ngo || ngo.userType !== 'Charity/NGO') {
            return res.status(404).json({ message: 'NGO not found' });
        }

        const totalOrders = await Order.countDocuments({ ngoId: req.params.id });
        const cancelledOrders = await Order.countDocuments({ ngoId: req.params.id, status: 'cancelled' });
        const fulfilledOrders = await Order.countDocuments({ ngoId: req.params.id, status: 'fulfilled' });
        const dismissedOrders = await Order.countDocuments({ ngoId: req.params.id, status: 'dismissed' });

        // Fetch reviews for the NGO
        const ngoReviews = await Order.find({ ngoId: req.params.id }).select('restReview');
        const reviews = ngoReviews.map(order => order.restReview);

        res.status(200).json({
            username: ngo.username,
            email: ngo.email,
            locationName: ngo.locationName,
            totalOrders,
            cancelledOrders,
            fulfilledOrders,
            dismissedOrders,
            reviews,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Controller function to get information about a specific restaurant by ID
export const getRestaurantInfo = async (req, res) => {
    try {
        const restaurant = await User.findById(req.params.id);
        if (!restaurant || restaurant.userType !== 'Restaurant') {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const totalOrders = await Order.countDocuments({ restaurantId: req.params.id });
        const cancelledOrders = await Order.countDocuments({ restaurantId: req.params.id, status: 'cancelled' });
        const fulfilledOrders = await Order.countDocuments({ restaurantId: req.params.id, status: 'fulfilled' });
        const dismissedOrders = await Order.countDocuments({ restaurantId: req.params.id, status: 'dismissed' });

        // Fetch reviews for the restaurant
        const restaurantReviews = await Order.find({ restaurantId: req.params.id }).select('ngoReview');
        const reviews = restaurantReviews.map(order => order.ngoReview);

        res.status(200).json({
            username: restaurant.username,
            email: restaurant.email,
            locationName: restaurant.locationName,
            totalOrders,
            cancelledOrders,
            fulfilledOrders,
            dismissedOrders,
            reviews,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
