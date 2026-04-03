const User = require('../models/User');

// @desc    Toggle product in favorites
// @route   POST /api/favorites/:id
exports.toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const productId = req.params.id;

        const index = user.favorites.indexOf(productId);
        if (index > -1) {
            user.favorites.splice(index, 1);
            await user.save();
            res.json({ message: 'Removed from favorites', favorites: user.favorites });
        } else {
            user.favorites.push(productId);
            await user.save();
            res.json({ message: 'Added to favorites', favorites: user.favorites });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user favorites
// @route   GET /api/favorites
exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
