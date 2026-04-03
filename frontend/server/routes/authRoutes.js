const express = require('express');
const { registerUser, authUser, getUserProfile, updateUserProfile, updateUserPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);

module.exports = router;
