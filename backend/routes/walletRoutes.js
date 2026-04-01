const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getWalletBalance, addMoney, getTransactions } = require('../controllers/walletController');

router.get('/', protect, getWalletBalance);
router.get('/transactions', protect, getTransactions);
router.post('/add', protect, addMoney);

module.exports = router;
