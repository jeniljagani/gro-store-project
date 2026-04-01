const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Product = require('./models/Product');

async function check() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/grostore');
    const count = await Product.countDocuments();
    const cats = await Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    console.log('Total products:', count);
    cats.forEach(c => console.log(`  ${c._id}: ${c.count}`));
    await mongoose.disconnect();
}

check();
