const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = require('../controllers/addressController');

router.route('/').get(protect, getAddresses).post(protect, addAddress);
router.put('/default/:id', protect, setDefaultAddress);
router.route('/:id').put(protect, updateAddress).delete(protect, deleteAddress);

module.exports = router;
