const Order = require('../models/Order');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Create new order
// @route   POST /api/orders
exports.addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalPrice, deliveryType, scheduledAt, paymentIntentId } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No items in the order. Please check your cart.' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
        return res.status(400).json({ message: 'Shipping address is incomplete. Please ensure address, city, postal code, and country are provided.' });
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Sanitize orderItems
        const sanitizedItems = orderItems.map(item => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: mongoose.isValidObjectId(item.product) ? item.product : null,
        }));

        // Handle Wallet Payment
        if (paymentMethod === 'wallet') {
            if (user.walletBalance < totalPrice) {
                return res.status(400).json({ message: 'Insufficient wallet balance' });
            }
            user.walletBalance -= Number(totalPrice);
            await user.save();
        }

        const isPaid = paymentMethod === 'stripe' || paymentMethod === 'wallet';

        const order = new Order({
            user: req.user._id,
            orderItems: sanitizedItems,
            shippingAddress,
            paymentMethod,
            totalPrice: Number(totalPrice),
            deliveryType,
            scheduledAt,
            paymentIntentId: paymentIntentId || null,
            isPaid,
            paidAt: isPaid ? new Date() : null,
            status: isPaid ? 'confirmed' : 'pending'
        });

        const createdOrder = await order.save();

        // Record Transaction if Wallet
        if (paymentMethod === 'wallet') {
            try {
                await Transaction.create({
                    user: req.user._id,
                    type: 'debit',
                    amount: Number(totalPrice),
                    title: `Order #${createdOrder._id.toString().slice(-6).toUpperCase()}`,
                    status: 'Completed',
                    orderId: createdOrder._id
                });
            } catch (txError) {
                console.error('Transaction creation failed:', txError);
            }
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get order by ID (with automated serverless progression logic)
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
    let order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (order) {
        // Automatic Progression Simulation for Serverless
        if (order.isPaid && order.status !== 'delivered' && order.status !== 'cancelled') {
            const ageMs = Date.now() - new Date(order.createdAt).getTime();
            
            // Surat, Gujarat, India coordinates
            const storeLat = 21.1702;
            const storeLng = 72.8311;
            const destLat = 21.1950;
            const destLng = 72.8600;

            let updated = false;

            if (ageMs > 90000 && order.status !== 'delivered') {
                order.status = 'delivered';
                order.isDelivered = true;
                order.deliveredAt = new Date();
                order.deliveryLocation = { lat: destLat, lng: destLng };
                updated = true;
            } else if (ageMs > 30000 && order.status !== 'out_for_delivery') {
                order.status = 'out_for_delivery';
                // Midpoint calculation rough
                order.deliveryLocation = { lat: (storeLat + destLat)/2, lng: (storeLng + destLng)/2 };
                updated = true;
            } else if (ageMs > 15000 && order.status !== 'preparing') {
                order.status = 'preparing';
                order.deliveryLocation = { lat: storeLat, lng: storeLng };
                updated = true;
            }

            if (updated) {
                await order.save();
            }
        }
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
    const { status, deliveryLocation } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        if (deliveryLocation) order.deliveryLocation = deliveryLocation;
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = new Date();
        }

        const updated = await order.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
