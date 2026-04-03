require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const vegPics = ['1566385101042-1a000c1267c8', '1597362868429-3bb28b2e5f3e', '1592924357228-91a4daadcfea', '1598170845058-32b996a695ee'];
const fruitPics = ['1610832958506-aa56368176cf', '1619566629098-59b5293932a3', '1528825871115-3581a5387919', '1490818387583-1bdaa5e63e2a'];
const dairyPics = ['1628088062854-d187cc746274', '1550583724-741ce2357ee7', '1563636619-e9100fa935ca', '1628088235393-29402512f451'];
const snackPics = ['1599490659223-2720fa28636b', '1613919113166-29b5d58688a1', '1592663527359-cf6642f54cff'];
const beveragePics = ['1544145945-f904253db0ad', '1581006852262-e4307cf6283a', '1551024709-8f23befc6f87'];
const personalPics = ['1556227702-d1e4e7b5c332', '1608248597279-f99d160bfcbc', '1556228578-8c7c2f1f0a00'];

async function updateImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');

        const products = await Product.find({});
        console.log(`Found ${products.length} products to update...`);

        let count = 0;
        for (let i = 0; i < products.length; i++) {
            let pics = [];
            const cat = products[i].category;
            
            if (cat === 'Fresh Vegetables') pics = vegPics;
            else if (cat === 'Fruits') pics = fruitPics;
            else if (cat === 'Dairy') pics = dairyPics;
            else if (cat === 'Snacks') pics = snackPics;
            else if (cat === 'Beverages') pics = beveragePics;
            else if (cat === 'Personal Care') pics = personalPics;

            if (pics.length > 0) {
                const picId = pics[i % pics.length];
                products[i].image = `https://images.unsplash.com/photo-${picId}?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60`;
                await products[i].save();
                count++;
            }
        }

        console.log(`🚀 Successfully updated ${count} product images with premium Unsplash content!`);
        process.exit();
    } catch (err) {
        console.error('❌ Error updating images:', err);
        process.exit(1);
    }
}

updateImages();
