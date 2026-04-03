const Address = require('../models/Address');

// @desc    Get all addresses for logged-in user
// @route   GET /api/address
const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
        res.json(addresses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Add new address
// @route   POST /api/address
const addAddress = async (req, res) => {
    try {
        const { name, phone, pincode, state, city, house, area, landmark, type, isDefault } = req.body;

        // If this is set as default, unset all others
        if (isDefault) {
            await Address.updateMany({ user: req.user._id }, { isDefault: false });
        }

        // If this is the first address, make it default
        const count = await Address.countDocuments({ user: req.user._id });

        const address = await Address.create({
            user: req.user._id,
            name,
            phone,
            pincode,
            state,
            city,
            house,
            area,
            landmark: landmark || '',
            type: type || 'Home',
            isDefault: isDefault || count === 0,
        });

        res.status(201).json(address);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update address
// @route   PUT /api/address/:id
const updateAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });
        if (address.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

        const { name, phone, pincode, state, city, house, area, landmark, type, isDefault } = req.body;

        if (isDefault) {
            await Address.updateMany({ user: req.user._id }, { isDefault: false });
        }

        address.name = name || address.name;
        address.phone = phone || address.phone;
        address.pincode = pincode || address.pincode;
        address.state = state || address.state;
        address.city = city || address.city;
        address.house = house || address.house;
        address.area = area || address.area;
        address.landmark = landmark !== undefined ? landmark : address.landmark;
        address.type = type || address.type;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        const updated = await address.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete address
// @route   DELETE /api/address/:id
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });
        if (address.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

        const wasDefault = address.isDefault;
        await Address.findByIdAndDelete(req.params.id);

        // If deleted address was default, make the next one default
        if (wasDefault) {
            const next = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
            if (next) {
                next.isDefault = true;
                await next.save();
            }
        }

        res.json({ message: 'Address removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Set address as default
// @route   PUT /api/address/default/:id
const setDefaultAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });
        if (address.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

        await Address.updateMany({ user: req.user._id }, { isDefault: false });
        address.isDefault = true;
        const updated = await address.save();

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };
