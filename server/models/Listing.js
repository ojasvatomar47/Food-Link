import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    view: {
        type: String,
        enum: ['blocked', 'not blocked'],
        default: 'not blocked'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Expiration field to store the expiration time
    expiresAt: {
        type: Date,
        // Calculate the expiration time based on the current time and expiry in hours
        default: function () {
            return new Date(Date.now() + this.expiry * 60 * 60 * 1000);
        }
    }
});

// TTL index on expiresAt field
listingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;