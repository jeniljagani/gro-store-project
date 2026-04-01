console.log('--- Server Startup Initiated ---');
require('dotenv').config();
console.log('--- Dotenv Loaded ---');
const express = require('express');
console.log('--- Express Loaded ---');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedData = require('./utils/seeder');

console.log('--- Modules Loaded ---');
const authRoutes = require('./routes/authRoutes');
console.log('--- Auth Routes Loaded ---');
const productRoutes = require('./routes/productRoutes');
console.log('--- Product Routes Loaded ---');
const orderRoutes = require('./routes/orderRoutes');
console.log('--- Order Routes Loaded ---');
const favoriteRoutes = require('./routes/favoriteRoutes');
console.log('--- Favorite Routes Loaded ---');
const recipeRoutes = require('./routes/recipeRoutes');
console.log('--- Recipe Routes Loaded ---');
const chatRoutes = require('./routes/chatRoutes');
console.log('--- Chat Routes Loaded ---');
const addressRoutes = require('./routes/addressRoutes');
console.log('--- Address Routes Loaded ---');
const walletRoutes = require('./routes/walletRoutes');
console.log('--- Wallet Routes Loaded ---');
const paymentRoutes = require('./routes/paymentRoutes');
console.log('--- Payment Routes Loaded ---');

console.log('--- Creating App ---');
const app = express();
app.use(express.json());
app.use(cors());

console.log('--- Setting up Routes ---');
// Routes
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
    res.send('API is running...');
});

console.log('--- Creating HTTP Server ---');
// Create HTTP server + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Store io on app so controllers can access it
app.set('io', io);

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Client joins room for specific order
    socket.on('joinOrder', (orderId) => {
        socket.join(orderId);
        console.log(`Socket ${socket.id} joined order room: ${orderId}`);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

console.log('--- Setting up Port and DB ---');
// Handle Unhandled Rejections / Exceptions
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

const PORT = process.env.PORT || 5000;

console.log('--- Connecting to MongoDB ---');
mongoose.set('strictQuery', false);

const connectDB = async () => {
    let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/grostore';
    let isMemory = false;

    try {
        // Try connecting to the provided MONGO_URI first
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('--- MongoDB Connected Successfully ---');
    } catch (err) {
        console.warn('--- Standard MongoDB Connection Failed ---');
        console.log('Error Details:', err.message);
        
        console.log('--- Starting In-Memory MongoDB for Development ---');
        try {
            const mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
            isMemory = true;
            
            await mongoose.connect(mongoUri);
            console.log('--- In-Memory MongoDB Started Successfully ---');
            console.log('URI:', mongoUri);
            
            // Seed the in-memory database
            console.log('--- Seeding In-Memory Database ---');
            await seedData();
            console.log('--- Seeding Complete ---');
        } catch (memErr) {
            console.error('--- Critical: Failed to start In-Memory MongoDB ---', memErr.message);
            process.exit(1);
        }
    }

    server.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        console.log(`Local Access: http://localhost:${PORT}`);
        if (isMemory) console.log('NOTE: You are using an In-Memory database. Data will be lost on restart.');
    });
};

connectDB();
