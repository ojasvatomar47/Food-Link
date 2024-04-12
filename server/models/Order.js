import mongoose from 'mongoose';
import Listing from './Listing.js'; // Importing the Listing model
import User from './User.js'; // Importing the User model

const orderSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model for restaurant
        required: true
    },
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model for NGO
        required: true
    },
    listings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    }],
    status: {
        type: String,
        enum: ['accepted', 'declined', 'requested', 'fulfilled', 'cancelled'],
        default: 'requested'
    },
    restCode: {
        type: String
    },
    ngoCode: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-decline and auto-cancel after 2 hours
orderSchema.pre('save', async function (next) {
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    if (this.status === 'requested' && this.createdAt <= twoHoursAgo) {
        this.status = 'declined';
        // Set all associated listings to 'not blocked'
        await Promise.all(this.listings.map(async (listingId) => {
            const listing = await Listing.findById(listingId);
            if (listing) {
                listing.view = 'not blocked';
                await listing.save();
            }
        }));
    }

    if (this.status === 'accepted' && this.createdAt <= twoHoursAgo && (this.status !== 'fulfilled' || this.status !== 'cancelled')) {
        this.status = 'cancelled';
        // Set all associated listings to 'not blocked'
        await Promise.all(this.listings.map(async (listingId) => {
            const listing = await Listing.findById(listingId);
            if (listing) {
                listing.view = 'not blocked';
                await listing.save();
            }
        }));
    }

    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;