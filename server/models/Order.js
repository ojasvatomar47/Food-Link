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
        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        expiry: {
            type: Number,
            required: true,
            enum: [1, 2, 3, 480] // 1, 2, 3 hrs
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        restaurantName: {
            type: String,
            required: true
        },
        view: {
            type: String,
            enum: ['blocked', 'not blocked'],
            default: 'not blocked'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['accepted', 'declined', 'requested', 'fulfilled', 'cancelled', 'dismissed'],
        default: 'requested'
    },
    restCode: {
        type: String
    },
    ngoCode: {
        type: String
    },
    restReview: {
        type: String,
        default: ''
    },
    ngoReview: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-decline and auto-dismiss after 2 hours
orderSchema.pre('save', async function (next) {
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    if (this.status === 'requested' && this.createdAt <= twoHoursAgo) {
        this.status = 'declined';
        // Set all associated listings to 'not blocked'
        await Promise.all(this.listings.map(async (listing) => {
            const foundListing = await Listing.findById(listing.listing);
            if (foundListing) {
                foundListing.view = 'not blocked';
                await foundListing.save();
            }
        }));
    }

    if (this.status === 'accepted' && this.createdAt <= twoHoursAgo) {
        this.status = 'dismissed';
        // Set all associated listings to 'not blocked'
        await Promise.all(this.listings.map(async (listing) => {
            const foundListing = await Listing.findById(listing.listing);
            if (foundListing) {
                foundListing.view = 'not blocked';
                await foundListing.save();
            }
        }));
    }

    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
