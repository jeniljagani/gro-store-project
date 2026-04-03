require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
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
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
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

app.get('/', (req, res) => {
    res.json({ message: 'Gro-Store API is running ✅', env: process.env.NODE_ENV || 'development' });
});

// ─── Socket.IO ────────────────────────────────────────────────────────────────
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('joinOrder', (orderId) => {
        socket.join(orderId);
        console.log(`Socket ${socket.id} joined order: ${orderId}`);
    });

    socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected:', socket.id);
    });
});

// ─── Error Handlers ───────────────────────────────────────────────────────────
process.on('unhandledRejection', (err) => {
    console.error('⚠️  Unhandled Rejection:', err.message);
});

process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err.message);
    process.exit(1);
});

// ─── Database + Server Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose.set('strictQuery', false);

const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;

    // ── Try Atlas / provided URI first ──
    if (MONGO_URI && !MONGO_URI.includes('localhost')) {
        try {
            await mongoose.connect(MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
            });
            console.log('✅ MongoDB Atlas Connected');

            // Seed DB only if products collection is empty
            const Product = require('./models/Product');
            const count = await Product.countDocuments();
            if (count === 0) {
                console.log('📦 Database is empty — seeding data...');
                await seedData();
                console.log('✅ Database seeded successfully');
            } else {
                console.log(`📦 Database already has ${count} products — skipping seed`);
            }

            server.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT} [Atlas DB]`);
            });
            return;
        } catch (err) {
            console.error('❌ MongoDB Atlas connection failed:', err.message);
            console.log('⚠️  Falling back to local/in-memory MongoDB...');
        }
    }

    // ── Try localhost MongoDB ──
    if (MONGO_URI && MONGO_URI.includes('localhost')) {
        try {
            await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
            console.log('✅ MongoDB Local Connected');

            const Product = require('./models/Product');
            const count = await Product.countDocuments();
            if (count === 0) {
                console.log('📦 Database is empty — seeding data...');
                await seedData();
                console.log('✅ Database seeded successfully');
            } else {
                console.log(`📦 Database already has ${count} products — skipping seed`);
            }

            server.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT} [Local DB]`);
            });
            return;
        } catch (err) {
            console.warn('⚠️  Local MongoDB failed:', err.message);
            console.log('📦 Starting in-memory MongoDB for development...');
        }
    }

    // ── In-memory fallback (dev only) ──
    try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const memUri = mongoServer.getUri();

        await mongoose.connect(memUri);
        console.log('✅ In-Memory MongoDB started (dev fallback)');
        console.log('⚠️  NOTE: Data will be lost when server restarts!');

        console.log('📦 Seeding in-memory database...');
        await seedData();
        console.log('✅ In-memory database seeded');

        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} [In-Memory DB]`);
        });
    } catch (memErr) {
        console.error('💥 Critical: Failed to start any MongoDB:', memErr.message);
        process.exit(1);
    }
};

connectDB();
