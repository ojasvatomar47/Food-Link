import Order from '../models/Order.js';
import Listing from '../models/Listing.js';
import crypto from 'crypto';

// Create a new order request
export const createOrder = async (req, res) => {
    const { restaurantId, listings } = req.body;

    try {
        // Block view of the selected listings
        await Promise.all(listings.map(async (listingId) => {
            const listing = await Listing.findById(listingId);
            if (listing) {
                listing.view = 'blocked';
                await listing.save();
            }
        }));

        // Create the order
        const newOrder = new Order({
            restaurantId,
            ngoId: req.user._id, // Assuming req.user contains NGO's ID
            listings,
            status: 'requested'
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all orders for a particular restaurant
export const getOrdersByRestaurant = async (req, res) => {
    const { _id: restaurantId } = req.user; // Assuming req.user contains restaurant's ID

    try {
        const orders = await Order.find({ restaurantId })
            .sort({ createdAt: 'desc' }); // Sort by descending createdAt
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all orders for a particular NGO
export const getOrdersByNGO = async (req, res) => {
    const { _id: ngoId } = req.user; // Assuming req.user contains NGO's ID

    try {
        const orders = await Order.find({ ngoId })
            .sort({ createdAt: 'desc' }); // Sort by descending createdAt
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const declineOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status: 'declined' },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await Promise.all(updatedOrder.listings.map(async (listingId) => {
            const listing = await Listing.findById(listingId);
            if (listing) {
                listing.view = 'not blocked';
                await listing.save();
            }
        }));

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Accept an order
export const acceptOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Generate two unique codes for NGO and restaurant
        const ngoCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        const restCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        order.status = 'accepted';
        order.ngoCode = ngoCode;
        order.restCode = restCode;

        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Cancel an order
export const cancelOrder = async (req, res) => {
    const { id } = req.params;
    const { code } = req.body;
    const { userType } = req.user; // Assuming req.user contains user's type (restaurant or NGO)

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the requesting party matches the order's restaurant or NGO
        let partyCode;
        if (userType === 'Restaurant') {
            partyCode = order.ngoCode;
        } else if (userType === 'Charity/NGO') {
            partyCode = order.restCode;
        }

        if (!partyCode) {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        if (code !== partyCode) {
            return res.status(400).json({ message: 'Invalid code' });
        }

        // Delete listings associated with the order
        for (const listingId of order.listings) {
            await Listing.findByIdAndDelete(listingId);
        }

        order.status = 'cancelled';
        await order.save();

        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Fulfill an order
export const fulfillOrder = async (req, res) => {
    const { id } = req.params;
    const { code } = req.body;
    const { userType } = req.user; // Assuming req.user contains user's type (restaurant or NGO)

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the requesting party matches the order's restaurant or NGO
        let partyCode;
        if (userType === 'Restaurant') {
            partyCode = order.ngoCode;
        } else if (userType === 'Charity/NGO') {
            partyCode = order.restCode;
        }

        if (!partyCode) {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        if (code !== partyCode) {
            return res.status(400).json({ message: 'Invalid code' });
        }

        // Delete listings associated with the order
        for (const listingId of order.listings) {
            await Listing.findByIdAndDelete(listingId);
        }

        order.status = 'fulfilled';
        await order.save();

        res.json({ message: 'Order fulfilled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};