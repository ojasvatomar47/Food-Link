import Order from '../models/Order.js';
import Listing from '../models/Listing.js';
import crypto from 'crypto';
import Chat from '../models/Chat.js';

// Create a new order request
export const createOrder = async (req, res) => {
    const { restaurantId, listings, ngoId } = req.body;

    try {
        // Block view of the selected listings
        // await Promise.all(listings.map(async (listingId) => {
        //     const listing = await Listing.findById(listingId);
        //     if (listing) {
        //         listing.view = 'blocked';
        //         await listing.save();
        //     }
        // }));

        // Create the order
        const newOrder = new Order({
            restaurantId,
            ngoId,
            listings,
            status: 'requested'
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get a particular order
export const getOrderInfo = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Fetch order details
        const order = await Order.findById(orderId)
            .populate('restaurantId', 'username') // Fetching restaurant name
            .populate('ngoId', 'username'); // Fetching NGO name

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get all orders for a particular restaurant
export const getOrdersByRestaurant = async (req, res) => {
    const { restaurantId } = req.query;

    try {
        const orders = await Order.find({ restaurantId })
            .populate({
                path: 'ngoId',
                select: 'username'  // Assuming the NGO model has a 'username' field
            })
            .sort({ createdAt: 'desc' }); // Sort by descending createdAt

        // Map through orders to format data as needed
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            restaurantId: order.restaurantId,
            ngoId: order.ngoId._id,
            ngoName: order.ngoId.username,
            listings: order.listings,
            status: order.status,
            createdAt: order.createdAt,
            restCode: order.restCode,
            ngoCode: order.ngoCode,
            restReview: order.restReview,
            ngoReview: order.ngoReview
        }));

        res.json(formattedOrders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all orders for a particular NGO
export const getOrdersByNGO = async (req, res) => {
    const { ngoId } = req.query;

    try {
        const orders = await Order.find({ ngoId })
            .populate({
                path: 'restaurantId',
                select: 'username'  // Assuming the User model has a 'username' field
            })
            .populate('listings.listing')
            .sort({ createdAt: 'desc' }); // Sort by descending createdAt

        // Map through orders to format data as needed
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            restaurantId: order.restaurantId._id,
            restaurantName: order.restaurantId.username,  // Assuming the User model has a 'username' field
            ngoId: order.ngoId,
            listings: order.listings,
            status: order.status,
            createdAt: order.createdAt,
            restCode: order.restCode,
            ngoCode: order.ngoCode,
            restReview: order.restReview,
            ngoReview: order.ngoReview
        }));

        res.json(formattedOrders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Decline an order
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

        // Block the view of each listing in the order
        await Promise.all(order.listings.map(async (list) => {
            const listing = await Listing.findById(list.listing);
            if (listing) {
                listing.view = 'blocked';
                await listing.save();
            }
        }));

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Cancel an order
export const cancelOrder = async (req, res) => {
    const { id } = req.params;
    const { code, userType } = req.body;

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

        // Unblock view for listings associated with the order
        for (const listingId of order.listings) {
            const listing = await Listing.findById(listingId);
            if (listing) {
                listing.view = 'not blocked';
                await listing.save();
            }
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
    const { code, userType } = req.body;

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

// Add review from restaurant
export const addRestReview = async (req, res) => {
    const { orderId } = req.params;
    const { review } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.restReview) {
            return res.status(400).json({ message: 'Review already added' });
        }

        order.restReview = review;
        await order.save();

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Add review from NGO
export const addNgoReview = async (req, res) => {
    const { orderId } = req.params;
    const { review } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.ngoReview) {
            return res.status(400).json({ message: 'Review already added' });
        }

        order.ngoReview = review;
        await order.save();

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get chat messages for a particular order id
export const getMessagesByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Fetch messages from the database for the specific order ID
        const messages = await Chat.find({ orderId });

        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};