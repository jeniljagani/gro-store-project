import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, Minus, Plus, Trash2, MapPin, Clock, CreditCard,
    ChevronRight, ChevronDown, Shield, Star, Zap, Truck, Check,
    Home, Briefcase, Phone, Wallet, Smartphone, Banknote,
    Gift, Tag, Rocket, Package, BadgeCheck, ArrowLeft, X,
    PartyPopper, CheckCircle2, Timer, CircleDot, Pencil, Plus as PlusIcon, Building2
} from 'lucide-react';
import { removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AddressDrawer from '../components/checkout/AddressDrawer';
import DeleteConfirmModal from '../components/checkout/DeleteConfirmModal';
import DeliverySlotDrawer from '../components/checkout/DeliverySlotDrawer';

// ─── Step Indicator ───────────────────────────────────────────────
const steps = ['Cart', 'Address', 'Payment', 'Confirm'];
const StepIndicator = ({ current }) => (
    <div className="flex items-center justify-center gap-2 mb-12">
        {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
                <motion.div
                    animate={{
                        scale: i === current ? 1.1 : 1,
                        backgroundColor: i <= current ? '#22c55e' : '#e2e8f0',
                    }}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ color: i <= current ? '#fff' : '#94a3b8' }}
                >
                    {i < current ? <Check className="w-4 h-4" /> : i + 1}
                </motion.div>
                <span className={`text-xs font-bold hidden sm:block ${i <= current ? 'text-primary' : 'text-slate-300'}`}>
                    {step}
                </span>
                {i < steps.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 ${i < current ? 'bg-primary' : 'bg-slate-200'}`} />
                )}
            </div>
        ))}
    </div>
);

// ─── Cart Item Card ───────────────────────────────────────────────
const CartItemCard = ({ item, dispatch }) => {
    const [swiped, setSwiped] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -200, height: 0, marginBottom: 0, padding: 0 }}
            className="relative overflow-hidden rounded-3xl"
        >
            {/* Swipe Actions Background */}
            <AnimatePresence>
                {swiped && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-red-50 rounded-3xl flex items-center justify-end pr-6 gap-3 z-0"
                    >
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dispatch(removeFromCart(item._id))}
                            className="px-5 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Remove
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                drag="x"
                dragConstraints={{ left: -120, right: 0 }}
                onDragEnd={(_, info) => {
                    if (info.offset.x < -60) setSwiped(true);
                    else setSwiped(false);
                }}
                animate={{ x: swiped ? -120 : 0 }}
                className="relative z-10 bg-white border border-slate-100 rounded-3xl p-5 flex items-center gap-5 cursor-grab active:cursor-grabbing"
            >
                {/* Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 p-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{item.category}</p>
                    <h4 className="font-bold text-slate-800 text-base truncate">{item.name}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {item.selectedWeight || `${item.quantity || 1}${item.unit || 'pcs'}`}
                    </p>
                    {item.stock <= 3 && item.stock > 0 && (
                        <span className="text-[10px] text-orange-500 font-bold mt-1 inline-block">
                            ⚠ Only {item.stock} left
                        </span>
                    )}
                </div>

                {/* Qty Controls */}
                <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 p-1">
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => {
                            if (item.qty <= 1) dispatch(removeFromCart(item._id));
                            else dispatch(updateQuantity({ id: item._id, qty: item.qty - 1 }));
                        }}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                    >
                        {item.qty <= 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-4 h-4" />}
                    </motion.button>
                    <motion.span
                        key={item.qty}
                        initial={{ scale: 1.3, color: '#22c55e' }}
                        animate={{ scale: 1, color: '#1e293b' }}
                        className="w-8 text-center font-black text-sm"
                    >
                        {item.qty}
                    </motion.span>
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => dispatch(updateQuantity({ id: item._id, qty: item.qty + 1 }))}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </motion.button>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                    <motion.p
                        key={item.price * item.qty}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-lg font-black text-slate-900"
                    >
                        ₹{(item.price * item.qty).toFixed(0)}
                    </motion.p>
                    {item.qty > 1 && (
                        <p className="text-[10px] text-slate-400 font-medium">₹{item.price.toFixed(0)} each</p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Address Type Icon Map ────────────────────────────────────────
const addrIconMap = { Home, Work: Briefcase, Other: Building2 };

// ─── Delivery Options ─────────────────────────────────────────────
const deliveryOptions = [
    { id: 'express', label: 'Express Delivery', time: '10 min', icon: Rocket, price: 29, badge: 'Fastest', color: 'text-primary' },
    { id: 'standard', label: 'Standard Delivery', time: '30 min', icon: Truck, price: 0, badge: 'Free', color: 'text-blue-500' },
    { id: 'scheduled', label: 'Schedule for Later', time: 'Choose slot', icon: Clock, price: 0, badge: '', color: 'text-amber-500' },
];

// ─── Payment Options ──────────────────────────────────────────────
const paymentOptions = [
    { id: 'upi', label: 'UPI', icon: Smartphone, apps: ['Google Pay', 'PhonePe', 'Paytm'] },
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
];

// ─── Coupons ──────────────────────────────────────────────────────
const availableCoupons = [
    { code: 'FRESH50', discount: 50, minOrder: 299, desc: '₹50 off on orders above ₹299' },
    { code: 'FIRST100', discount: 100, minOrder: 499, desc: '₹100 off on your first order' },
    { code: 'HEALTHY20', discount: 20, minOrder: 0, desc: 'Flat ₹20 off on all orders' },
];

// ─── SUCCESS OVERLAY ──────────────────────────────────────────────
const OrderSuccessOverlay = ({ onTrack }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
    >
        <div className="text-center px-6 max-w-lg">
            {/* Animated Checkmark */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                className="w-32 h-32 bg-gradient-to-br from-primary to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-200"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <CheckCircle2 className="w-16 h-16 text-white" />
                </motion.div>
            </motion.div>

            {/* Confetti Dots */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 0, x: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        y: [0, -(Math.random() * 300 + 100)],
                        x: [(Math.random() - 0.5) * 400],
                    }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 1.5 }}
                    className="absolute"
                    style={{
                        left: '50%',
                        top: '45%',
                        width: 8 + Math.random() * 8,
                        height: 8 + Math.random() * 8,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        backgroundColor: ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
                    }}
                />
            ))}

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-4xl sm:text-5xl font-black text-slate-900 mb-4"
            >
                Order Placed! 🎉
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-slate-500 text-lg mb-10"
            >
                Your order is being prepared and will arrive soon.
            </motion.p>

            {/* Delivery ETA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="inline-flex items-center gap-3 bg-green-50 border border-primary/20 px-8 py-4 rounded-2xl mb-10"
            >
                <Timer className="w-5 h-5 text-primary" />
                <span className="font-bold text-primary">Estimated delivery: 10-15 min</span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
            >
                <button
                    onClick={onTrack}
                    className="px-10 py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-200 hover:scale-105 transition-transform"
                >
                    Track Order
                </button>
                <button
                    onClick={onTrack}
                    className="px-10 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-colors"
                >
                    Continue Shopping
                </button>
            </motion.div>
        </div>
    </motion.div>
);

// ═══════════════════════════════════════════════════════════════════
// ─── MAIN CHECKOUT COMPONENT ──────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
const CheckoutChamber = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);

    // States
    const [step, setStep] = useState(0);
    const [selectedDelivery, setSelectedDelivery] = useState('express');
    const [selectedPayment, setSelectedPayment] = useState('upi');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isPlacing, setIsPlacing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [showCoupons, setShowCoupons] = useState(false);

    // Address states
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Slot states
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [slotDrawerOpen, setSlotDrawerOpen] = useState(false);

    // Payment refinements
    const { balance: walletBalance } = useSelector(state => state.wallet);
    const [selectedUpiApp, setSelectedUpiApp] = useState(null);
    const COD_FEE = 25;

    const getAuthConfig = useCallback(() => ({
        headers: { Authorization: `Bearer ${user?.token}` }
    }), [user]);

    // Fetch addresses
    useEffect(() => {
        if (!user?.token) { setAddressLoading(false); return; }
        const load = async () => {
            try {
                const { data } = await axios.get('/api/address', getAuthConfig());
                setAddresses(data);
                const def = data.find(a => a.isDefault) || data[0];
                if (def) setSelectedAddress(def._id);
            } catch (e) { console.error(e); }
            finally { setAddressLoading(false); }
        };
        load();
    }, [user, getAuthConfig]);

    // Save address (add or update)
    const handleSaveAddress = async (form, editId) => {
        try {
            if (editId) {
                const { data } = await axios.put(`/api/address/${editId}`, form, getAuthConfig());
                setAddresses(prev => {
                    let updated = prev.map(a => a._id === editId ? data : a);
                    if (data.isDefault) updated = updated.map(a => a._id !== data._id ? { ...a, isDefault: false } : a);
                    return updated;
                });
                toast.success('Address updated successfully!');
            } else {
                const { data } = await axios.post('/api/address', form, getAuthConfig());
                setAddresses(prev => {
                    let updated = [...prev, data];
                    if (data.isDefault) updated = updated.map(a => a._id !== data._id ? { ...a, isDefault: false } : a);
                    return updated;
                });
                setSelectedAddress(data._id);
                toast.success('Address saved successfully!');
            }
            setDrawerOpen(false);
            setEditingAddress(null);
        } catch (e) {
            console.error('Error saving address:', e);
            const msg = e.response?.data?.message || 'Failed to save address. Please try again.';
            toast.error(msg);
        }
    };

    // Delete address
    const handleDeleteAddress = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`/api/address/${deleteTarget}`, getAuthConfig());
            setAddresses(prev => {
                const remaining = prev.filter(a => a._id !== deleteTarget);
                // If deleted was default, server promotes next; re-fetch to sync
                return remaining;
            });
            if (selectedAddress === deleteTarget) {
                const remaining = addresses.filter(a => a._id !== deleteTarget);
                setSelectedAddress(remaining[0]?._id || null);
            }
            setDeleteTarget(null);
        } catch (e) { console.error(e); }
        finally { setDeleteLoading(false); }
    };

    // Set default
    const handleSetDefault = async (id) => {
        try {
            await axios.put(`/api/address/default/${id}`, {}, getAuthConfig());
            setAddresses(prev => prev.map(a => ({ ...a, isDefault: a._id === id })));
        } catch (e) { console.error(e); }
    };

    // Calculations
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const deliveryFee = deliveryOptions.find(d => d.id === selectedDelivery)?.price || 0;
    const discount = appliedCoupon?.discount || 0;
    const codFee = selectedPayment === 'cod' ? COD_FEE : 0;
    const total = Math.max(0, subtotal + deliveryFee + codFee - discount);
    const mrpTotal = subtotal * 1.25; // Mock MRP
    const savings = mrpTotal - subtotal + discount;

    const applyCoupon = (code) => {
        const coupon = availableCoupons.find(c => c.code === code.toUpperCase());
        if (coupon && subtotal >= coupon.minOrder) {
            setAppliedCoupon(coupon);
            setCouponCode(coupon.code);
            setShowCoupons(false);
        }
    };

    const placeOrder = async () => {
        if (!user) return navigate('/login');
        if (!selectedAddress) {
            toast.error('Please select a delivery address to continue.');
            setStep(1); // Redirect view to address step
            return;
        }
        setIsPlacing(true);

        try {
            const config = getAuthConfig();
            const addr = addresses.find(a => a._id === selectedAddress);

            // Calculate scheduledAt date
            let scheduledAt = null;
            if (selectedDelivery === 'scheduled' && selectedSlot) {
                const date = new Date(selectedSlot.date);
                // Convert time slot like "07:00 AM - 09:00 AM" to start hour
                const hour = parseInt(selectedSlot.time.split(':')[0]);
                const isPM = selectedSlot.time.includes('PM') && hour !== 12;
                date.setHours(isPM ? hour + 12 : hour, 0, 0, 0);
                scheduledAt = date.toISOString();
            }

            const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

            await axios.post('/api/orders', {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: isValidObjectId(item._id) ? item._id : null,
                })),
                shippingAddress: {
                    address: `${addr?.house || ''}, ${addr?.area || ''}`,
                    city: addr?.city || '',
                    postalCode: addr?.pincode || '',
                    country: 'India',
                },
                paymentMethod: selectedPayment,
                deliveryType: selectedDelivery,
                scheduledAt,
                totalPrice: total,
            }, config);

            if (selectedPayment === 'wallet') {
                dispatch(getWalletBalance());
            }

            dispatch(clearCart());
            setTimeout(() => {
                setIsPlacing(false);
                setOrderSuccess(true);
            }, 2000);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
            setIsPlacing(false);
        }
    };

    // ─── EMPTY CART ───
    if (cartItems.length === 0 && !orderSuccess) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-white">
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
                        <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag className="w-14 h-14 text-slate-200" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Your cart is empty</h2>
                        <p className="text-slate-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:scale-105 transition-transform"
                        >
                            Start Shopping
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // ─── SUCCESS OVERLAY ───
    if (orderSuccess) {
        return <OrderSuccessOverlay onTrack={() => navigate('/shop')} />;
    }

    return (
        <div className="pt-28 pb-40 min-h-screen bg-[#FAFBFC]">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-primary mb-6 font-medium transition-colors">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Checkout</h1>
                    <p className="text-slate-400 font-medium">{cartItems.length} items in your cart</p>
                </motion.div>

                <StepIndicator current={step} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ─── LEFT COLUMN ─── */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* ═══ SECTION 1: SMART CART ═══ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-6 sm:p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <ShoppingBag className="w-5 h-5 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900">Your Items</h2>
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                                    {cartItems.length} items
                                </span>
                            </div>

                            <AnimatePresence mode="popLayout">
                                <div className="space-y-4">
                                    {cartItems.map(item => (
                                        <CartItemCard key={item._id} item={item} dispatch={dispatch} />
                                    ))}
                                </div>
                            </AnimatePresence>

                            {/* Swipe hint */}
                            <p className="text-[10px] text-slate-300 text-center mt-4 font-medium">← Swipe item to remove</p>
                        </motion.div>

                        {/* ═══ SECTION 2: ADDRESS ═══ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-6 sm:p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900">Delivery Address</h2>
                                </div>
                                <motion.button whileTap={{ scale: 0.93 }}
                                    onClick={() => { setEditingAddress(null); setDrawerOpen(true); }}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors">
                                    <PlusIcon className="w-3.5 h-3.5" /> Add New
                                </motion.button>
                            </div>

                            {/* Address Loading */}
                            {addressLoading && (
                                <div className="space-y-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="animate-pulse p-5 rounded-2xl border border-slate-100">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                                                    <div className="h-3 bg-slate-50 rounded w-2/3" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {!addressLoading && addresses.length === 0 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-center py-10">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <h3 className="font-bold text-slate-400 mb-1">No address found</h3>
                                    <p className="text-sm text-slate-300 mb-5">Add a delivery address to continue</p>
                                    <motion.button whileTap={{ scale: 0.95 }}
                                        onClick={() => { setEditingAddress(null); setDrawerOpen(true); }}
                                        className="px-8 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-green-100">
                                        Add Address
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Address Cards */}
                            {!addressLoading && addresses.length > 0 && (
                                <div className="space-y-3">
                                    <AnimatePresence mode="popLayout">
                                        {addresses.map(addr => {
                                            const Icon = addrIconMap[addr.type] || MapPin;
                                            const isActive = selectedAddress === addr._id;
                                            return (
                                                <motion.div
                                                    key={addr._id}
                                                    layout
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                                                    whileTap={{ scale: 0.985 }}
                                                    onClick={() => { setSelectedAddress(addr._id); if (step < 1) setStep(1); }}
                                                    className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all ${isActive
                                                        ? 'border-primary bg-green-50/50 shadow-lg shadow-green-100/50'
                                                        : 'border-slate-100 bg-white hover:border-slate-200'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                <span className="font-bold text-slate-900">{addr.name}</span>
                                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${addr.type === 'Home' ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                                    : addr.type === 'Work' ? 'bg-amber-50 text-amber-600 border-amber-100'
                                                                        : 'bg-slate-50 text-slate-500 border-slate-100'
                                                                    }`}>{addr.type?.toUpperCase()}</span>
                                                                {addr.isDefault && (
                                                                    <span className="text-[9px] font-bold text-primary bg-green-50 px-2 py-0.5 rounded-lg border border-primary/10">DEFAULT</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                                {addr.house}, {addr.area}{addr.landmark ? `, ${addr.landmark}` : ''}
                                                            </p>
                                                            <p className="text-sm text-slate-500">{addr.city}, {addr.state} — {addr.pincode}</p>
                                                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                                <Phone className="w-3 h-3" /> {addr.phone}
                                                            </p>
                                                        </div>
                                                        {isActive && (
                                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0">
                                                                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                                                                    <Check className="w-4 h-4 text-white" />
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </div>

                                                    {/* Action buttons */}
                                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100/80">
                                                        <button onClick={(e) => { e.stopPropagation(); setEditingAddress(addr); setDrawerOpen(true); }}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                                            <Pencil className="w-3 h-3" /> Edit
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(addr._id); }}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                                            <Trash2 className="w-3 h-3" /> Delete
                                                        </button>
                                                        {!addr.isDefault && (
                                                            <button onClick={(e) => { e.stopPropagation(); handleSetDefault(addr._id); }}
                                                                className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors ml-auto">
                                                                <Star className="w-3 h-3" /> Set Default
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>

                        {/* ═══ SECTION 3: DELIVERY TIME ═══ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-6 sm:p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-amber-500" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">Delivery Time</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {deliveryOptions.map(opt => {
                                    const Icon = opt.icon;
                                    const isActive = selectedDelivery === opt.id;
                                    return (
                                        <motion.button
                                            key={opt.id}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSelectedDelivery(opt.id);
                                                if (opt.id === 'scheduled') setSlotDrawerOpen(true);
                                                if (step < 1) setStep(1);
                                            }}
                                            className={`p-5 rounded-2xl border-2 text-center transition-all ${isActive
                                                ? 'border-primary bg-green-50/50 shadow-lg shadow-green-50'
                                                : 'border-slate-100 hover:border-slate-200'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${isActive ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <p className="font-bold text-slate-800 text-sm">{opt.label}</p>
                                            <p className={`text-sm font-black mt-1 ${isActive && opt.id === 'scheduled' && selectedSlot ? 'text-primary' : opt.color}`}>
                                                {opt.id === 'scheduled' && selectedSlot ? selectedSlot.time : opt.time}
                                            </p>
                                            {opt.id === 'scheduled' && selectedSlot && (
                                                <p className="text-[10px] font-bold text-slate-400 mt-1">
                                                    {new Date(selectedSlot.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </p>
                                            )}
                                            {opt.badge && !selectedSlot && (
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg mt-2 inline-block ${opt.badge === 'Fastest' ? 'bg-green-50 text-primary' : 'bg-blue-50 text-blue-500'
                                                    }`}>
                                                    {opt.badge}
                                                </span>
                                            )}
                                            {opt.price > 0 && (
                                                <p className="text-xs text-slate-400 mt-1">+₹{opt.price}</p>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Live ETA */}
                            {selectedDelivery === 'express' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 flex items-center gap-3 bg-green-50 border border-primary/10 p-4 rounded-2xl"
                                >
                                    <Rocket className="w-5 h-5 text-primary flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-primary">Arriving between 5:30 PM – 5:40 PM</p>
                                        <p className="text-xs text-primary/60">Powered by instant delivery</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* ═══ SECTION 4: PAYMENT ═══ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-6 sm:p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-purple-500" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">Payment Method</h2>
                            </div>

                            <div className="space-y-3">
                                {paymentOptions.map(opt => {
                                    const Icon = opt.icon;
                                    const isActive = selectedPayment === opt.id;
                                    return (
                                        <div key={opt.id}>
                                            <motion.button
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => { setSelectedPayment(opt.id); if (step < 2) setStep(2); }}
                                                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${isActive
                                                    ? 'border-primary bg-green-50/50'
                                                    : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <span className="font-bold text-slate-800 block">{opt.id === 'wallet' ? 'FreshGo Wallet' : opt.label}</span>
                                                    {opt.id === 'wallet' && (
                                                        <span className="text-[10px] font-bold text-slate-400">Available Balance: ₹{walletBalance}</span>
                                                    )}
                                                    {opt.id === 'cod' && (
                                                        <span className="text-[10px] font-bold text-amber-500 block">₹{COD_FEE} convenience fee applies</span>
                                                    )}
                                                </div>
                                                <CircleDot className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-200'}`} />
                                            </motion.button>

                                            {/* UPI Apps */}
                                            <AnimatePresence>
                                                {isActive && opt.apps && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="flex gap-2 p-4 pt-2 pl-14">
                                                            {opt.apps.map(app => (
                                                                <button
                                                                    key={app}
                                                                    onClick={(e) => { e.stopPropagation(); setSelectedUpiApp(app); }}
                                                                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${selectedUpiApp === app ? 'bg-primary border-primary text-white shadow-md shadow-green-100' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'}`}
                                                                >
                                                                    {app}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Card Input */}
                                            <AnimatePresence>
                                                {isActive && opt.id === 'card' && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="grid grid-cols-2 gap-3 pt-3 pl-14">
                                                            <input placeholder="Card Number" className="col-span-2 px-4 py-3 bg-slate-50 rounded-xl text-sm border border-slate-100 focus:border-primary outline-none" />
                                                            <input placeholder="MM/YY" className="px-4 py-3 bg-slate-50 rounded-xl text-sm border border-slate-100 focus:border-primary outline-none" />
                                                            <input placeholder="CVV" className="px-4 py-3 bg-slate-50 rounded-xl text-sm border border-slate-100 focus:border-primary outline-none" type="password" />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* ─── RIGHT COLUMN (STICKY SUMMARY) ─── */}
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-28 space-y-6">

                            {/* ═══ SECTION 5: COUPON ═══ */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Tag className="w-5 h-5 text-amber-500" />
                                    <h3 className="font-bold text-slate-900">Apply Coupon</h3>
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium border border-slate-100 focus:border-primary outline-none"
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => applyCoupon(couponCode)}
                                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm"
                                    >
                                        Apply
                                    </motion.button>
                                </div>

                                {appliedCoupon && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-2 bg-green-50 border border-primary/10 p-3 rounded-xl">
                                        <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-xs font-bold text-primary flex-1">{appliedCoupon.code} applied — ₹{appliedCoupon.discount} off!</span>
                                        <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-slate-400 hover:text-red-500">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                )}

                                <button onClick={() => setShowCoupons(!showCoupons)} className="text-xs text-primary font-bold mt-3 hover:underline">
                                    {showCoupons ? 'Hide coupons' : 'View available coupons'}
                                </button>

                                <AnimatePresence>
                                    {showCoupons && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="space-y-2 mt-3">
                                                {availableCoupons.map(c => (
                                                    <div
                                                        key={c.code}
                                                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200"
                                                    >
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-black text-primary bg-green-50 px-2 py-0.5 rounded">{c.code}</span>
                                                                <span className="text-[10px] text-slate-400">Min. ₹{c.minOrder}</span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 mt-0.5">{c.desc}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => applyCoupon(c.code)}
                                                            className="px-3 py-1 bg-white border border-primary text-[10px] font-black text-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                                                        >
                                                            APPLY
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* ═══ SECTION 5: ORDER SUMMARY ═══ */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-6 sm:p-8"
                            >
                                <h3 className="font-black text-slate-900 text-xl mb-6">Order Summary</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Item Total</span>
                                        <span className="font-bold text-slate-700">₹{subtotal.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Delivery Fee</span>
                                        <span className={`font-bold ${deliveryFee === 0 ? 'text-primary' : 'text-slate-700'}`}>
                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                        </span>
                                    </div>
                                    {discount > 0 && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between text-sm">
                                            <span className="text-primary font-bold">Coupon Discount</span>
                                            <span className="font-bold text-primary">-₹{discount}</span>
                                        </motion.div>
                                    )}
                                    {selectedPayment === 'cod' && (
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between text-sm">
                                            <span className="text-slate-500">COD Convenience Fee</span>
                                            <span className="font-bold text-slate-700">₹{COD_FEE}</span>
                                        </motion.div>
                                    )}

                                    <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between">
                                        <span className="font-black text-slate-900 text-lg">Total</span>
                                        <motion.span
                                            key={total}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            className="font-black text-slate-900 text-2xl"
                                        >
                                            ₹{total.toFixed(0)}
                                        </motion.span>
                                    </div>
                                </div>

                                {/* Savings */}
                                {savings > 5 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-4 flex items-center gap-2 bg-green-50 border border-primary/10 p-3 rounded-xl"
                                    >
                                        <Gift className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-xs font-bold text-primary">
                                            You're saving ₹{savings.toFixed(0)} on this order!
                                        </span>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* ═══ SECTION 6: PLACE ORDER ═══ */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setStep(3);
                                        placeOrder();
                                    }}
                                    disabled={isPlacing || cartItems.length === 0}
                                    className={`w-full py-6 rounded-[1.8rem] font-black text-xl flex items-center justify-center gap-3 transition-all ${isPlacing
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-primary to-emerald-400 text-white shadow-2xl shadow-green-200 hover:shadow-green-300'
                                        }`}
                                >
                                    {isPlacing ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                                            />
                                            Placing your order...
                                        </>
                                    ) : (
                                        <>
                                            Place Order — ₹{total.toFixed(0)}
                                            <ChevronRight className="w-6 h-6" />
                                        </>
                                    )}
                                </motion.button>

                                {/* Trust */}
                                <div className="flex items-center justify-center gap-6 mt-5">
                                    <div className="flex items-center gap-1.5 text-slate-300">
                                        <Shield className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold">Secure Checkout</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-300">
                                        <BadgeCheck className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold">100% Safe</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-300">
                                        <Star className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold">Trusted</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Drawer */}
            <AddressDrawer
                isOpen={drawerOpen}
                onClose={() => { setDrawerOpen(false); setEditingAddress(null); }}
                onSave={handleSaveAddress}
                editAddress={editingAddress}
            />

            {/* Delete Confirmation */}
            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteAddress}
                loading={deleteLoading}
            />

            {/* Delivery Slot Drawer */}
            <DeliverySlotDrawer
                isOpen={slotDrawerOpen}
                onClose={() => setSlotDrawerOpen(false)}
                onSelect={setSelectedSlot}
                currentSlot={selectedSlot}
            />
        </div>
    );
};

export default CheckoutChamber;
