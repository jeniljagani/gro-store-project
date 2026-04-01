const Stripe = require('stripe');

// Lazy init so server starts even before real keys are set
function getStripe() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key.includes('YOUR_STRIPE')) {
        throw new Error('Stripe secret key not configured. Add STRIPE_SECRET_KEY to backend/.env');
    }
    return Stripe(key);
}

// @desc    Create Stripe Payment Intent
// @route   POST /api/payment/create-intent
exports.createPaymentIntent = async (req, res) => {
    const { amount } = req.body; // amount in dollars

    try {
        const stripe = getStripe();
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // convert to cents
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
        });

        res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
    } catch (error) {
        console.error('Stripe error:', error.message);
        res.status(500).json({ message: error.message });
    }
};
