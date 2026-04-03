require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const seedData = require('./utils/seeder');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const chatRoutes = require('./routes/chatRoutes');
const addressRoutes = require('./routes/addressRoutes');
const walletRoutes = require('./routes/walletRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
// Allowing all origins for Vercel Serverless ease
app.use(cors({
    origin: true,
    credentials: true,
}));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api', (req, res) => {
    res.json({ message: 'Gro-Store Serverless API ✅', env: process.env.NODE_ENV || 'development' });
});

// ─── Database Connection (Serverless Cached) ──────────────────────────────────
mongoose.set('strictQuery', false);

let cachedDb = null;

const connectDB = async () => {
    if (cachedDb) return cachedDb;

    const MONGO_URI = process.env.MONGO_URI;

    if (MONGO_URI && !MONGO_URI.includes('localhost')) {
        try {
            cachedDb = await mongoose.connect(MONGO_URI, {
                serverSelectionTimeoutMS: 8000,
            });
            console.log('✅ MongoDB Atlas Connected (Serverless)');
            
            const Product = require('./models/Product');
            const count = await Product.countDocuments();
            if (count === 0) {
                console.log('📦 Database is empty — seeding data...');
                await seedData();
            }
            return cachedDb;
        } catch (err) {
            console.error('❌ MongoDB Atlas connection failed:', err.message);
        }
    }

    // Dev Fallback
    try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const memUri = mongoServer.getUri();
        cachedDb = await mongoose.connect(memUri);
        console.log('✅ In-Memory MongoDB started (Local/Dev Fallback)');
        await seedData();
        return cachedDb;
    } catch (memErr) {
        console.error('💥 Critical: Failed to start MongoDB:', memErr.message);
    }
};

connectDB().then(() => {
    // Run local server if not on Vercel
    if (!process.env.VERCEL) {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 API Server running locally on port ${PORT} with DB connected!`));
    }
});

// Export for Vercel Serverless
module.exports = app;
