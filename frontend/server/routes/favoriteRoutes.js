const express = require('express');
const { toggleFavorite, getFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getFavorites);

router.route('/:id')
    .post(protect, toggleFavorite);

module.exports = router;
