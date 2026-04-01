const Recipe = require('../models/Recipe');

// @desc    Fetch all recipes
// @route   GET /api/recipes
exports.getRecipes = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            name: { $regex: req.query.keyword, $options: 'i' }
        } : {};

        const recipes = await Recipe.find({ ...keyword }).populate('ingredients.product');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single recipe
// @route   GET /api/recipes/:id
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('ingredients.product');
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
