const mongoose = require('mongoose');
const Product = require('../models/Product');
const Recipe = require('../models/Recipe');

function makeWeightOptions(basePrice, type) {
    if (type === 'weight-g') {
        const p250 = Math.round(basePrice * 0.55);
        const p500 = basePrice;
        const p1kg = Math.round(basePrice * 1.85);
        const p2kg = Math.round(basePrice * 3.5);
        return [
            { label: '250g', price: p250 },
            { label: '500g', price: p500 },
            { label: '1kg', price: p1kg },
            { label: '2kg', price: p2kg },
        ];
    }
    if (type === 'weight-ml') {
        const p250 = Math.round(basePrice * 0.5);
        const p500 = basePrice;
        const p1l = Math.round(basePrice * 1.8);
        const p2l = Math.round(basePrice * 3.3);
        return [
            { label: '250ml', price: p250 },
            { label: '500ml', price: p500 },
            { label: '1L', price: p1l },
            { label: '2L', price: p2l },
        ];
    }
    if (type === 'pieces') {
        const p1 = basePrice;
        const p3 = Math.round(basePrice * 2.7);
        const p6 = Math.round(basePrice * 5);
        const p12 = Math.round(basePrice * 9);
        return [
            { label: '1 pc', price: p1 },
            { label: '3 pcs', price: p3 },
            { label: '6 pcs', price: p6 },
            { label: '12 pcs', price: p12 },
        ];
    }
    if (type === 'pack') {
        const single = basePrice;
        const travel = Math.round(basePrice * 0.6);
        const combo = Math.round(basePrice * 2.5);
        return [
            { label: 'Travel Size', price: travel },
            { label: 'Standard', price: single },
            { label: 'Combo Pack', price: combo },
        ];
    }
    return [{ label: 'Standard', price: basePrice }];
}

const seedData = async () => {
    try {
        await Product.deleteMany({});
        await Recipe.deleteMany({});
        console.log('Cleared existing products and recipes.');

        const products = [];
        const vegetables = [
            'Potato', 'Onion', 'Tomato', 'Cabbage', 'Cauliflower', 'Broccoli', 'Carrot', 'Beetroot', 'Radish', 'Spinach',
            'Coriander', 'Mint', 'Fenugreek Leaves', 'Green Peas', 'Capsicum Green', 'Capsicum Red', 'Capsicum Yellow', 'Brinjal', 'Bottle Gourd', 'Bitter Gourd',
            'Ridge Gourd', 'Snake Gourd', 'Pumpkin', 'Sweet Corn', 'Mushroom', 'Garlic', 'Ginger', 'Green Chilli', 'Curry Leaves', 'Spring Onion',
            'Raw Banana', 'Drumstick', 'Ivy Gourd', 'Ash Gourd', 'Turnip', 'Zucchini', 'Lettuce', 'Cherry Tomato', 'Kale', 'Celery',
            'Parsley', 'Leek', 'Baby Corn', 'Red Cabbage', 'Shallots', 'Yam', 'Colocasia', 'Lotus Stem', 'Arbi', 'Raw Mango',
            'Fresh Turmeric'
        ];
        const leafyVegs = ['Spinach', 'Coriander', 'Mint', 'Parsley', 'Kale', 'Fenugreek Leaves', 'Curry Leaves'];
        
        // Premium Unsplash Vegetable IDs
        const vegPics = [
            '1566385101042-1a000c1267c8', '1597362868429-3bb28b2e5f3e', '1592924357228-91a4daadcfea', '1598170845058-32b996a695ee', 
            '1524172862047-418363daeb7d', '1518843875459-f738682238a6', '1610348725531-843dff14a28a', '1587049352846-4a222e784d38'
        ];

        vegetables.forEach((name, i) => {
            const isLeafy = leafyVegs.includes(name) || name.includes('Leaves');
            const basePrice = Math.floor(Math.random() * 80) + 20;
            const picId = vegPics[i % vegPics.length];
            products.push({
                name,
                description: `Premium organic ${name.toLowerCase()}. Hand-picked and farm-fresh for superior taste and nutrition.`,
                price: basePrice,
                image: `https://images.unsplash.com/photo-${picId}?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60`,
                category: 'Fresh Vegetables',
                unit: isLeafy ? 'pcs' : 'g',
                quantity: isLeafy ? 1 : 500,
                weightOptions: isLeafy ? makeWeightOptions(basePrice, 'pieces') : makeWeightOptions(basePrice, 'weight-g'),
                rating: (Math.random() * (5 - 4.2) + 4.2).toFixed(1),
                numReviews: Math.floor(Math.random() * 300) + 45,
                nutrition: { calories: Math.floor(Math.random() * 40) + 15, protein: (Math.random() * 2).toFixed(1), carbs: (Math.random() * 8).toFixed(1), fat: (Math.random() * 0.5).toFixed(1) },
                isTrending: i < 6
            });
        });

        const fruits = ['Banana', 'Apple', 'Mango', 'Orange', 'Grapes Green', 'Grapes Black', 'Pineapple', 'Papaya', 'Watermelon', 'Muskmelon', 'Pomegranate', 'Guava', 'Kiwi', 'Strawberry', 'Blueberry', 'Raspberry', 'Blackberry', 'Pear', 'Peach', 'Plum', 'Cherry', 'Dragon Fruit', 'Avocado', 'Coconut', 'Custard Apple', 'Fig', 'Lychee', 'Passion Fruit', 'Star Fruit', 'Sweet Lime', 'Tangerine', 'Clementine', 'Jackfruit', 'Jamun', 'Mulberry', 'Dates Fresh', 'Apricot', 'Cranberry', 'Longan', 'Rambutan', 'Sapota (Chikoo)', 'Raw Papaya', 'Frozen Berries', 'Frozen Mango', 'Frozen Strawberry', 'Apple Green', 'Apple Red Delicious', 'Grapefruit', 'Banana Robusta', 'Banana Elaichi', 'Tender Coconut'];
        
        // Premium Unsplash Fruit IDs
        const fruitPics = [
            '1610832958506-aa56368176cf', '1619566629098-59b5293932a3', '1528825871115-3581a5387919', '1490818387583-1bdaa5e63e2a',
            '1536629237225-7287955c91f1', '1618897996318-c99ec43be84b', '1557800636-894a64c1696f', '1443444453373-040224bf1757'
        ];

        fruits.forEach((name, i) => {
            const isBerry = ['Strawberry', 'Blueberry', 'Raspberry', 'Blackberry', 'Cherry', 'Grapes Green', 'Grapes Black'].includes(name);
            const basePrice = Math.floor(Math.random() * 150) + 40;
            const picId = fruitPics[i % fruitPics.length];
            products.push({
                name,
                description: `A grade ${name.toLowerCase()}. Exceptionally sweet, juicy and packed with natural vitamins.`,
                price: basePrice,
                image: `https://images.unsplash.com/photo-${picId}?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60`,
                category: 'Fruits',
                unit: isBerry ? 'g' : 'pcs',
                quantity: isBerry ? 250 : 1,
                weightOptions: isBerry ? makeWeightOptions(basePrice, 'weight-g') : makeWeightOptions(basePrice, 'pieces'),
                rating: (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
                numReviews: Math.floor(Math.random() * 500) + 120,
                nutrition: { calories: Math.floor(Math.random() * 80) + 30, protein: (Math.random() * 1.5).toFixed(1), carbs: (Math.random() * 20).toFixed(1), fat: (Math.random() * 0.8).toFixed(1) },
                isTrending: i < 6
            });
        });

        const dairy = ['Full Cream Milk', 'Toned Milk', 'Double Toned Milk', 'Skim Milk', 'Almond Milk', 'Soy Milk', 'Oat Milk', 'Coconut Milk', 'Paneer', 'Cheese Cubes', 'Cheese Slices', 'Mozzarella Cheese', 'Cheddar Cheese', 'Parmesan Cheese', 'Butter Salted', 'Butter Unsalted', 'Ghee', 'Fresh Cream', 'Whipping Cream', 'Yogurt Plain', 'Greek Yogurt', 'Flavored Yogurt', 'Buttermilk', 'Lassi Sweet', 'Lassi Salted', 'Ice Cream Vanilla', 'Ice Cream Chocolate', 'Ice Cream Strawberry', 'Frozen Yogurt', 'Milk Powder', 'Condensed Milk', 'Evaporated Milk', 'Cream Cheese', 'Cheese Spread', 'Flavored Milk Chocolate', 'Flavored Milk Strawberry', 'Flavored Milk Badam', 'Probiotic Drink Yakult', 'Amul Masti Dahi', 'Amul Paneer', 'Britannia Cheese', 'Milkshake Mango', 'Milkshake Chocolate', 'Rabri', 'Kulfi', 'Dairy Whitener', 'Butter Garlic', 'Cheese Dip', 'Cheese Block', 'Organic Milk', 'Lactose Free Milk'];
        
        // Premium Unsplash Dairy IDs
        const dairyPics = [
            '1628088062854-d187cc746274', '1550583724-741ce2357ee7', '1563636619-e9100fa935ca', '1628088235393-29402512f451',
            '1589923158776-cb4485d99fd6', '1606791405792-1004f1718d0c', '1486297678162-ad2a19b8884d', '1549466600-880313f8c5b0'
        ];

        dairy.forEach((name, i) => {
            const isLiquid = name.toLowerCase().includes('milk') || name.toLowerCase().includes('drink') || name.toLowerCase().includes('lassi') || name.toLowerCase().includes('buttermilk');
            const basePrice = Math.floor(Math.random() * 400) + 30;
            const picId = dairyPics[i % dairyPics.length];
            products.push({
                name,
                description: `Premium quality ${name.toLowerCase()}. Sourced from high-grade dairy farms.`,
                price: basePrice,
                image: `https://images.unsplash.com/photo-${picId}?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60`,
                category: 'Dairy',
                unit: isLiquid ? 'ml' : 'g',
                quantity: isLiquid ? 500 : 200,
                weightOptions: isLiquid ? makeWeightOptions(basePrice, 'weight-ml') : makeWeightOptions(basePrice, 'weight-g'),
                rating: (Math.random() * (5 - 4.1) + 4.1).toFixed(1),
                numReviews: Math.floor(Math.random() * 1000) + 200,
                nutrition: { calories: Math.floor(Math.random() * 200) + 50, protein: (Math.random() * 10).toFixed(1), carbs: (Math.random() * 6).toFixed(1), fat: (Math.random() * 15).toFixed(1) },
                isTrending: i < 6
            });
        });

        // --- SNACKS (50+) ---
        const snacks = [
            'Potato Chips', 'Nachos', 'Tortilla Chips', 'Popcorn', 'Cheese Balls', 'Kurkure', 'Namkeen Mixture', 'Bhujia', 'Sev', 'Peanuts Salted',
            'Peanuts Masala', 'Roasted Almonds', 'Roasted Cashew', 'Trail Mix', 'Protein Bars', 'Energy Bars', 'Biscuits Marie', 'Biscuits Cream', 'Cookies Chocolate', 'Cookies Butter',
            'Crackers', 'Rusk', 'Toast', 'Cup Noodles', 'Instant Pasta', 'Instant Poha', 'Instant Upma', 'Instant Soup', 'Cornflakes', 'Muesli',
            'Granola', 'Oats', 'Khakhra', 'Thepla Pack', 'Samosa Frozen', 'French Fries Frozen', 'Nuggets Frozen', 'Spring Rolls Frozen', 'Chocolate Bar', 'Dark Chocolate',
            'Candy', 'Jelly', 'Marshmallow', 'Dry Fruit Mix', 'Fox Nuts (Makhana)', 'Rice Cakes', 'Chips Banana', 'Chips Tapioca', 'Energy Drink Snack', 'Protein Chips',
            'Nacho Cheese Dip'
        ];
        const snackPics = ['1599490659223-2720fa28636b', '1613919113166-29b5d58688a1', '1592663527359-cf6642f54cff', '1573537805874-4cedc5d389ce'];

        snacks.forEach((name, i) => {
            const basePrice = Math.floor(Math.random() * 250) + 20;
            const picId = snackPics[i % snackPics.length];
            products.push({
                name,
                description: `Delicious and crunchy ${name.toLowerCase()}. The perfect snack for every occasion.`,
                price: basePrice,
                image: `https://images.unsplash.com/photo-${picId}?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60`,
                category: 'Snacks',
                unit: 'g',
                quantity: 150,
                weightOptions: makeWeightOptions(basePrice, 'weight-g'),
                rating: (Math.random() * (5 - 4.3) + 4.3).toFixed(1),
                numReviews: Math.floor(Math.random() * 2000) + 500,
                nutrition: { calories: Math.floor(Math.random() * 400) + 150, protein: (Math.random() * 8).toFixed(1), carbs: (Math.random() * 40).toFixed(1), fat: (Math.random() * 20).toFixed(1) },
                isTrending: i < 6
            });
        });

        // --- BEVERAGES (50+) ---
        const beverages = [
            'Mineral Water', 'Sparkling Water', 'Soda', 'Coca Cola', 'Pepsi', 'Sprite', 'Fanta', 'Mountain Dew', 'Thums Up', 'Limca',
            'Fruit Juice Orange', 'Fruit Juice Mango', 'Fruit Juice Apple', 'Mixed Fruit Juice', 'Coconut Water', 'Energy Drink Red Bull', 'Energy Drink Monster', 'Cold Coffee', 'Iced Tea', 'Green Tea',
            'Black Tea', 'Herbal Tea', 'Coffee Powder', 'Coffee Beans', 'Instant Coffee', 'Milkshake', 'Smoothie', 'Protein Shake', 'Horlicks', 'Bournvita',
            'Boost', 'Lemon Juice', 'Jaljeera Drink', 'Buttermilk Drink', 'Lassi Mango', 'Flavored Water', 'Vitamin Water', 'Kombucha', 'Aloe Vera Juice', 'Sugarcane Juice',
            'Chocolate Drink', 'Badam Drink', 'Rose Milk', 'Malt Drink', 'Tea Premix', 'Coffee Premix', 'Energy Shot', 'Electrolyte Drink', 'ORS Drink', 'Tonic Water',
            'Ginger Ale'
        ];
        const beveragePics = ['1544145945-f904253db0ad', '1581006852262-e4307cf6283a', '1551024709-8f23befc6f87', '1513558161293-cdaf765ed2fd'];

        beverages.forEach((name, i) => {
            const isPowder = name.toLowerCase().includes('powder') || name.toLowerCase().includes('beans') || name.toLowerCase().includes('premix');
            const basePrice = Math.floor(Math.random() * 200) + 20;
            const picId = beveragePics[i % beveragePics.length];
            products.push({
                name,
                description: `Refreshing ${name.toLowerCase()}. Quench your thirst with premium quality. Best served chilled.`,
                price: basePrice,
                image: `https://images.unsplash.com/photo-${picId}?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60`,
                category: 'Beverages',
                unit: isPowder ? 'g' : 'ml',
                quantity: isPowder ? 200 : 300,
                weightOptions: isPowder ? makeWeightOptions(basePrice, 'weight-g') : makeWeightOptions(basePrice, 'weight-ml'),
                rating: (Math.random() * (5 - 3.9) + 3.9).toFixed(1),
                numReviews: Math.floor(Math.random() * 1500) + 100,
                nutrition: { calories: Math.floor(Math.random() * 150), protein: (Math.random() * 1).toFixed(1), carbs: (Math.random() * 25).toFixed(1), fat: 0 },
                isTrending: i < 6
            });
        });

        // --- PERSONAL CARE (50+) ---
        const personalCare = [
            'Bath Soap', 'Handwash', 'Facewash', 'Shampoo', 'Conditioner', 'Hair Oil', 'Body Lotion', 'Face Cream', 'Sunscreen', 'Toothpaste',
            'Toothbrush', 'Mouthwash', 'Deodorant', 'Perfume', 'Body Spray', 'Shaving Cream', 'Razor', 'Face Scrub', 'Face Mask', 'Lip Balm',
            'Talcum Powder', 'Hand Sanitizer', 'Wet Wipes', 'Toilet Paper', 'Tissue Paper', 'Feminine Hygiene Pads', 'Tampons', 'Intimate Wash', 'Baby Shampoo', 'Baby Lotion',
            'Baby Powder', 'Baby Soap', 'Hair Gel', 'Hair Wax', 'Hair Spray', 'Beard Oil', 'Beard Wash', 'Comb', 'Hair Brush', 'Nail Cutter',
            'Cotton', 'Cotton Buds', 'Antiseptic Liquid', 'Dettol Soap', 'Face Serum', 'Night Cream', 'Day Cream', 'Body Wash', 'Loofah', 'Foot Cream',
            'Hand Cream'
        ];
        const personalPics = ['1556227702-d1e4e7b5c332', '1608248597279-f99d160bfcbc', '1556228578-8c7c2f1f0a00', '1556229162-d150241b1819'];

        personalCare.forEach((name, i) => {
            const basePrice = Math.floor(Math.random() * 600) + 50;
            const picId = personalPics[i % personalPics.length];
            products.push({
                name,
                description: `Gentle and effective ${name.toLowerCase()}. Dermatologically tested for your daily wellness.`,
                price: basePrice,
                image: `https://images.unsplash.com/photo-${picId}?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60`,
                category: 'Personal Care',
                unit: 'pcs',
                quantity: 1,
                weightOptions: makeWeightOptions(basePrice, 'pack'),
                rating: (Math.random() * (5 - 4.6) + 4.6).toFixed(1),
                numReviews: Math.floor(Math.random() * 500) + 30,
                nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
                isTrending: i < 6
            });
        });

        const createdProducts = await Product.insertMany(products);
        console.log(`${createdProducts.length} products inserted.`);

        const indianRecipes = [
            { name: 'Paneer Butter Masala', time: 35, base: 'Paneer' },
            { name: 'Chicken Tikka Masala', time: 45, base: 'Chicken' },
            { name: 'Dal Makhani', time: 60, base: 'Lentils' },
            { name: 'Palak Paneer', time: 30, base: 'Paneer' },
            { name: 'Aloo Gobi', time: 25, base: 'Potato' },
            { name: 'Vegetable Biryani', time: 55, base: 'Rice' },
            { name: 'Masala Dosa', time: 30, base: 'Rice' },
            { name: 'Pav Bhaji', time: 35, base: 'Potato' },
            { name: 'Poha', time: 15, base: 'Flaked Rice' },
            { name: 'Kadai Paneer', time: 30, base: 'Paneer' }
        ];

        const recipes = indianRecipes.map(recipe => {
            const recipeIngredients = [];
            const baseProduct = createdProducts.find(p => p.name.toLowerCase().includes(recipe.base.toLowerCase()));
            if (baseProduct) {
                recipeIngredients.push({ product: baseProduct._id, quantityPerServing: 100, unit: baseProduct.unit });
            }
            while (recipeIngredients.length < 5) {
                const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
                if (!recipeIngredients.find(ri => ri.product.toString() === randomProduct._id.toString())) {
                    recipeIngredients.push({ product: randomProduct._id, quantityPerServing: 50, unit: randomProduct.unit });
                }
            }
            return {
                name: recipe.name,
                image: `https://loremflickr.com/800/600/indianfood,${recipe.name.toLowerCase().replace(/ /g, '')}`,
                cookingTime: recipe.time,
                servings: 4,
                category: 'Indian',
                instructions: ['Sauté base aromatics.', 'Add vegetables or protein.', 'Stir in spices.', 'Garnish and serve.'],
                ingredients: recipeIngredients
            };
        });

        await Recipe.insertMany(recipes);
        console.log('Recipes seeded.');
    } catch (error) {
        console.error('Seeding error:', error);
    }
};

module.exports = seedData;
