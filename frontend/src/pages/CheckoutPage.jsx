import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { clearCart } from '../redux/slices/cartSlice';
import { CreditCard, Lock, CheckCircle, ArrowLeft, Truck, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': { color: 'rgba(255,255,255,0.3)' },
        },
        invalid: { color: '#ef4444', iconColor: '#ef4444' },
    },
};

function CheckoutForm({ cartItems, subtotal, shippingAddress, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        try {
            // 1. Create payment intent on backend
            const intentRes = await fetch('/api/payment/create-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                },
                body: JSON.stringify({ amount: parseFloat(subtotal) })
            });
            const { clientSecret, paymentIntentId } = await intentRes.json();

            // 2. Confirm payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: user?.name || 'Customer' }
                }
            });

            if (result.error) {
                toast.error(result.error.message);
                setProcessing(false);
                return;
            }

            if (result.paymentIntent.status === 'succeeded') {
                // 3. Create order in our backend
                const orderRes = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({
                        orderItems: cartItems.map(item => ({
                            name: item.name,
                            qty: item.qty,
                            image: item.image,
                            price: item.price,
                            product: item._id
                        })),
                        shippingAddress,
                        paymentMethod: 'stripe',
                        totalPrice: parseFloat(subtotal),
                        deliveryType: 'express',
                        paymentIntentId
                    })
                });
                const order = await orderRes.json();
                dispatch(clearCart());
                setSucceeded(true);
                onSuccess(order._id);
            }
        } catch (err) {
            toast.error('Payment failed. Please try again.');
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    if (succeeded) {
        return (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-16"
            >
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Payment Successful!</h3>
                <p className="text-white/40">Redirecting to your order...</p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Mode Banner */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-blue-400 text-lg">ℹ️</span>
                <div>
                    <p className="text-blue-300 font-bold text-sm">Test Mode</p>
                    <p className="text-blue-300/60 text-xs">Use card: <span className="font-mono font-bold">4242 4242 4242 4242</span>, any future date & CVC</p>
                </div>
            </div>

            <div>
                <label className="text-white/40 font-bold uppercase tracking-widest text-xs mb-3 block">
                    Card Details
                </label>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-primary transition-colors">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
            </div>

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full py-5 bg-primary rounded-[2rem] text-white font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_-10px_rgba(34,197,94,0.4)] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {processing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4" />
                        Pay ₹{subtotal}
                    </>
                )}
            </button>

            <div className="flex items-center justify-center gap-2 text-white/20">
                <Lock className="w-3 h-3" />
                <p className="text-xs">256-bit SSL secured by Stripe</p>
            </div>
        </form>
    );
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const [orderId, setOrderId] = useState(null);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
    const shipping = 2.99;
    const total = (parseFloat(subtotal) + shipping).toFixed(2);

    // Default shipping address (could be from user profile)
    const shippingAddress = {
        address: 'Ring Road, Athwa Lines',
        city: 'Surat',
        postalCode: '395001',
        country: 'India'
    };

    const handleSuccess = (id) => {
        setOrderId(id);
        setTimeout(() => navigate(`/orders/${id}/track`), 2000);
    };

    useEffect(() => {
        if (!user) navigate('/login');
        // Only redirect to shop if no cart items AND not already placed an order successfully
        if (cartItems.length === 0 && !orderId && !succeeded) navigate('/shop');
    }, [user, cartItems, orderId, succeeded]);

    return (
        <div className="min-h-screen bg-slate-950 pt-20 pb-12">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Checkout</h1>
                        <p className="text-white/30 text-sm">{cartItems.length} items ready</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Payment */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Delivery Info */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-lg font-black text-white uppercase tracking-wider">Delivery</h2>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-white/40 font-bold uppercase tracking-widest text-xs">Address</span>
                                    <span className="text-white font-bold">{shippingAddress.address}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/40 font-bold uppercase tracking-widest text-xs">City</span>
                                    <span className="text-white font-bold">{shippingAddress.city}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/40 font-bold uppercase tracking-widest text-xs">Type</span>
                                    <span className="text-primary font-bold uppercase text-xs">⚡ Express</span>
                                </div>
                            </div>
                        </div>

                        {/* Stripe Payment */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-violet-400" />
                                </div>
                                <h2 className="text-lg font-black text-white uppercase tracking-wider">Payment</h2>
                            </div>
                            <Elements stripe={stripePromise}>
                                <CheckoutForm
                                    cartItems={cartItems}
                                    subtotal={total}
                                    shippingAddress={shippingAddress}
                                    onSuccess={handleSuccess}
                                />
                            </Elements>
                        </div>
                    </motion.div>

                    {/* Right: Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-amber-400" />
                                </div>
                                <h2 className="text-lg font-black text-white uppercase tracking-wider">Summary</h2>
                            </div>

                            <div className="space-y-4 mb-6">
                                {cartItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-white text-sm font-bold truncate">{item.name}</p>
                                            <p className="text-white/30 text-xs">x{item.qty}</p>
                                        </div>
                                        <p className="text-white font-mono font-bold text-sm">₹{(item.price * item.qty).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/10">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40 font-bold">Subtotal</span>
                                    <span className="text-white font-bold">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40 font-bold">Shipping</span>
                                    <span className="text-primary font-bold">₹{shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-white/10">
                                    <span className="text-white font-black uppercase tracking-widest text-sm">Total</span>
                                    <span className="text-3xl text-white font-black">₹{total}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
