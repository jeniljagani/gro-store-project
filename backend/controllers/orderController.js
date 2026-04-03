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

        // Sanitize orderItems — recipe ingredients may have fake string IDs, not real ObjectIds
        // We set product to null for those items instead of crashing with BSONError
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

        // Start auto-progression simulation for confirmed orders
        if (isPaid) {
            startDeliverySimulation(createdOrder._id, req.app.get('io'));
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
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

// @desc    Update order status (admin or simulation)
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

        // Emit via Socket.IO
        const io = req.app.get('io');
        if (io) {
            io.to(order._id.toString()).emit('orderUpdate', {
                status: updated.status,
                deliveryLocation: updated.deliveryLocation,
                isDelivered: updated.isDelivered
            });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delivery simulation: store -> customer, over ~2 minutes
function startDeliverySimulation(orderId, io) {
    const statuses = ['preparing', 'out_for_delivery', 'delivered'];
    const delays = [15000, 30000, 90000]; // 15s, 30s, 90s

    // Surat, Gujarat, India coordinates
    const storeLat = 21.1702;
    const storeLng = 72.8311;
    // Customer nearby in Surat
    const destLat = 21.1950;
    const destLng = 72.8600;

    statuses.forEach(async (status, i) => {
        setTimeout(async () => {
            try {
                const order = await Order.findById(orderId);
                if (!order || order.status === 'cancelled') return;

                order.status = status;

                if (status === 'out_for_delivery') {
                    order.deliveryLocation = { lat: storeLat, lng: storeLng };
                }
                if (status === 'delivered') {
                    order.isDelivered = true;
                    order.deliveredAt = new Date();
                    order.deliveryLocation = { lat: destLat, lng: destLng };
                }

                await order.save();

                if (io) {
                    io.to(orderId.toString()).emit('orderUpdate', {
                        status,
                        deliveryLocation: order.deliveryLocation,
                        isDelivered: order.isDelivered
                    });

                    // Animate delivery boy movement during out_for_delivery
                    if (status === 'out_for_delivery') {
                        animateDelivery(orderId, storeLat, storeLng, destLat, destLng, io);
                    }
                }
            } catch (err) {
                console.error('Simulation error:', err);
            }
        }, delays[i]);
    });
}

// Smoothly move delivery boy from store to destination
function animateDelivery(orderId, fromLat, fromLng, toLat, toLng, io) {
    const steps = 20;
    const interval = 3000; // every 3 seconds
    let step = 0;

    const timer = setInterval(async () => {
        step++;
        const progress = step / steps;
        const lat = fromLat + (toLat - fromLat) * progress;
        const lng = fromLng + (toLng - fromLng) * progress;

        const location = { lat, lng };

        try {
            await Order.findByIdAndUpdate(orderId, { deliveryLocation: location });
        } catch (e) {}

        if (io) {
            io.to(orderId.toString()).emit('locationUpdate', { lat, lng });
        }

        if (step >= steps) clearInterval(timer);
    }, interval);
}
