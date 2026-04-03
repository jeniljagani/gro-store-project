const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    cookingTime: { type: Number, required: true },
    servings: { type: Number, required: true },
    calories: { type: Number, default: 0 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    category: { type: String, default: 'Main Course' },
    ingredients: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String },
        quantityPerServing: { type: Number, required: true },
        unit: { type: String, required: true }
    }],
    instructions: [String],
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
