const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Base / default price
    image: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Fresh Vegetables', 'Fruits', 'Dairy', 'Snacks', 'Beverages', 'Personal Care']
    },
    unit: { type: String, required: true, enum: ['g', 'kg', 'ml', 'l', 'pcs'], default: 'pcs' },
    quantity: { type: Number, required: true, default: 1 },
    nutrition: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 }
    },
    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    // Each weight option has a label and its own price
    weightOptions: [{
        label: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    additionalImages: [{ type: String }],
    stock: { type: Number, default: 100 },
    isTrending: { type: Boolean, default: false },
    reviews: [reviewSchema],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
