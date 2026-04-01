const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get wallet balance
// @route   GET /api/wallet
exports.getWalletBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ balance: user.walletBalance || 0 });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get wallet transactions
// @route   GET /api/wallet/transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add money to wallet
// @route   POST /api/wallet/add
exports.addMoney = async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    try {
        const user = await User.findById(req.user._id);
        user.walletBalance = (user.walletBalance || 0) + Number(amount);
        await user.save();

        // Record transaction
        await Transaction.create({
            user: req.user._id,
            type: 'credit',
            amount: Number(amount),
            title: 'Money Added',
            status: 'Completed'
        });

        res.json({
            message: `₹${amount} added successfully!`,
            balance: user.walletBalance
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
