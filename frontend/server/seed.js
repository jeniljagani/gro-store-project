const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Recipe = require('./models/Recipe');

dotenv.config();

// Helper: generate weight options with realistic prices based on a base price
function makeWeightOptions(basePrice, type) {
    if (type === 'weight-g') {
        // Products sold by gram/kg
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
        // Products sold by ml/litre
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
        // Products sold by unit count
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
        // Personal care / combo packs
        const single = basePrice;
        const travel = Math.round(basePrice * 0.6);
        const combo = Math.round(basePrice * 2.5);
        return [
            { label: 'Travel Size', price: travel },
            { label: 'Standard', price: single },
            { label: 'Combo Pack', price: combo },
        ];
    }
    // Fallback
    return [{ label: 'Standard', price: basePrice }];
}

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/grostore');
        console.log('Connected to MongoDB for refined seeding...');

        await Product.deleteMany({});
        await Recipe.deleteMany({});
        console.log('Cleared existing products and recipes.');

        const products = [];

        // --- FRESH VEGETABLES (50+) ---
        const vegetables = [
            'Potato', 'Onion', 'Tomato', 'Cabbage', 'Cauliflower', 'Broccoli', 'Carrot', 'Beetroot', 'Radish', 'Spinach',
            'Coriander', 'Mint', 'Fenugreek Leaves', 'Green Peas', 'Capsicum Green', 'Capsicum Red', 'Capsicum Yellow', 'Brinjal', 'Bottle Gourd', 'Bitter Gourd',
            'Ridge Gourd', 'Snake Gourd', 'Pumpkin', 'Sweet Corn', 'Mushroom', 'Garlic', 'Ginger', 'Green Chilli', 'Curry Leaves', 'Spring Onion',
            'Raw Banana', 'Drumstick', 'Ivy Gourd', 'Ash Gourd', 'Turnip', 'Zucchini', 'Lettuce', 'Cherry Tomato', 'Kale', 'Celery',
            'Parsley', 'Leek', 'Baby Corn', 'Red Cabbage', 'Shallots', 'Yam', 'Colocasia', 'Lotus Stem', 'Arbi', 'Raw Mango',
            'Fresh Turmeric'
        ];
        const leafyVegs = ['Spinach', 'Coriander', 'Mint', 'Parsley', 'Kale', 'Fenugreek Leaves', 'Curry Leaves'];

        vegetables.forEach((name, i) => {
            const isLeafy = leafyVegs.includes(name) || name.includes('Leaves');
            const basePrice = Math.floor(Math.random() * 80) + 20;
            products.push({
                name,
                description: `Premium organic ${name.toLowerCase()}. Hand-picked and farm-fresh for superior taste and nutrition.`,
                price: basePrice,
                image: `https://loremflickr.com/600/600/vegetable,${name.toLowerCase().replace(/ /g, '')}`,
                additionalImages: [
                    `https://loremflickr.com/600/600/vegetable,${name.toLowerCase().replace(/ /g, '')},fresh`,
                    `https://loremflickr.com/600/600/vegetable,${name.toLowerCase().replace(/ /g, '')},organic`
                ],
                category: 'Fresh Vegetables',
                unit: isLeafy ? 'pcs' : 'g',
                quantity: isLeafy ? 1 : 500,
                weightOptions: isLeafy
                    ? makeWeightOptions(basePrice, 'pieces')
                    : makeWeightOptions(basePrice, 'weight-g'),
                rating: (Math.random() * (5 - 4.2) + 4.2).toFixed(1),
                numReviews: Math.floor(Math.random() * 300) + 45,
                nutrition: {
                    calories: Math.floor(Math.random() * 40) + 15,
                    protein: (Math.random() * 2).toFixed(1),
                    carbs: (Math.random() * 8).toFixed(1),
                    fat: (Math.random() * 0.5).toFixed(1)
                },
                isTrending: i < 6
            });
        });

        // --- FRUITS (50+) ---
        const fruits = [
            'Banana', 'Apple', 'Mango', 'Orange', 'Grapes Green', 'Grapes Black', 'Pineapple', 'Papaya', 'Watermelon', 'Muskmelon',
            'Pomegranate', 'Guava', 'Kiwi', 'Strawberry', 'Blueberry', 'Raspberry', 'Blackberry', 'Pear', 'Peach', 'Plum',
            'Cherry', 'Dragon Fruit', 'Avocado', 'Coconut', 'Custard Apple', 'Fig', 'Lychee', 'Passion Fruit', 'Star Fruit', 'Sweet Lime',
            'Tangerine', 'Clementine', 'Jackfruit', 'Jamun', 'Mulberry', 'Dates Fresh', 'Apricot', 'Cranberry', 'Longan', 'Rambutan',
            'Sapota (Chikoo)', 'Raw Papaya', 'Frozen Berries', 'Frozen Mango', 'Frozen Strawberry', 'Apple Green', 'Apple Red Delicious', 'Grapefruit', 'Banana Robusta', 'Banana Elaichi',
            'Tender Coconut'
        ];
        const berryFruits = ['Strawberry', 'Blueberry', 'Raspberry', 'Blackberry', 'Cherry', 'Grapes Green', 'Grapes Black'];

        fruits.forEach((name, i) => {
            const isBerry = berryFruits.includes(name);
            const basePrice = Math.floor(Math.random() * 150) + 40;
            products.push({
                name,
                description: `A grade ${name.toLowerCase()}. Exceptionally sweet, juicy and packed with natural vitamins.`,
                price: basePrice,
                image: `https://loremflickr.com/600/600/fruit,${name.toLowerCase().replace(/ /g, '')}`,
                additionalImages: [
                    `https://loremflickr.com/600/600/fruit,${name.toLowerCase().replace(/ /g, '')},fresh`,
                    `https://loremflickr.com/600/600/fruit,${name.toLowerCase().replace(/ /g, '')},juicy`
                ],
                category: 'Fruits',
                unit: isBerry ? 'g' : 'pcs',
                quantity: isBerry ? 250 : 1,
                weightOptions: isBerry
                    ? makeWeightOptions(basePrice, 'weight-g')
                    : makeWeightOptions(basePrice, 'pieces'),
                rating: (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
                numReviews: Math.floor(Math.random() * 500) + 120,
                nutrition: {
                    calories: Math.floor(Math.random() * 80) + 30,
                    protein: (Math.random() * 1.5).toFixed(1),
                    carbs: (Math.random() * 20).toFixed(1),
                    fat: (Math.random() * 0.8).toFixed(1)
                },
                isTrending: i < 6
            });
        });

        // --- DAIRY (50+) ---
        const dairy = [
            'Full Cream Milk', 'Toned Milk', 'Double Toned Milk', 'Skim Milk', 'Almond Milk', 'Soy Milk', 'Oat Milk', 'Coconut Milk', 'Paneer', 'Cheese Cubes',
            'Cheese Slices', 'Mozzarella Cheese', 'Cheddar Cheese', 'Parmesan Cheese', 'Butter Salted', 'Butter Unsalted', 'Ghee', 'Fresh Cream', 'Whipping Cream', 'Yogurt Plain',
            'Greek Yogurt', 'Flavored Yogurt', 'Buttermilk', 'Lassi Sweet', 'Lassi Salted', 'Ice Cream Vanilla', 'Ice Cream Chocolate', 'Ice Cream Strawberry', 'Frozen Yogurt', 'Milk Powder',
            'Condensed Milk', 'Evaporated Milk', 'Cream Cheese', 'Cheese Spread', 'Flavored Milk Chocolate', 'Flavored Milk Strawberry', 'Flavored Milk Badam', 'Probiotic Drink Yakult', 'Amul Masti Dahi', 'Amul Paneer',
            'Britannia Cheese', 'Milkshake Mango', 'Milkshake Chocolate', 'Rabri', 'Kulfi', 'Dairy Whitener', 'Butter Garlic', 'Cheese Dip', 'Cheese Block', 'Organic Milk',
            'Lactose Free Milk'
        ];

        dairy.forEach((name, i) => {
            const isLiquid = name.toLowerCase().includes('milk') || name.toLowerCase().includes('drink') || name.toLowerCase().includes('lassi') || name.toLowerCase().includes('buttermilk');
            const basePrice = Math.floor(Math.random() * 400) + 30;
            products.push({
                name,
                description: `Premium quality ${name.toLowerCase()}. Sourced from high-grade dairy farms.`,
                price: basePrice,
                image: `https://loremflickr.com/600/600/dairy,${name.toLowerCase().replace(/ /g, '')}`,
                additionalImages: [
                    `https://loremflickr.com/600/600/dairy,${name.toLowerCase().replace(/ /g, '')},fresh`,
                    `https://loremflickr.com/600/600/dairy,${name.toLowerCase().replace(/ /g, '')},pack`
                ],
                category: 'Dairy',
                unit: isLiquid ? 'ml' : 'g',
                quantity: isLiquid ? 500 : 200,
                weightOptions: isLiquid
                    ? makeWeightOptions(basePrice, 'weight-ml')
                    : makeWeightOptions(basePrice, 'weight-g'),
                rating: (Math.random() * (5 - 4.1) + 4.1).toFixed(1),
                numReviews: Math.floor(Math.random() * 1000) + 200,
                nutrition: {
                    calories: Math.floor(Math.random() * 200) + 50,
                    protein: (Math.random() * 10).toFixed(1),
                    carbs: (Math.random() * 6).toFixed(1),
                    fat: (Math.random() * 15).toFixed(1)
                },
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

        snacks.forEach((name, i) => {
            const basePrice = Math.floor(Math.random() * 250) + 20;
            products.push({
                name,
                description: `Delicious and crunchy ${name.toLowerCase()}. The perfect snack for every occasion.`,
                price: basePrice,
                image: `https://loremflickr.com/600/600/snack,${name.toLowerCase().replace(/ /g, '')}`,
                additionalImages: [
                    `https://loremflickr.com/600/600/snack,${name.toLowerCase().replace(/ /g, '')},delicious`,
                    `https://loremflickr.com/600/600/snack,${name.toLowerCase().replace(/ /g, '')},open`
                ],
                category: 'Snacks',
                unit: 'g',
                quantity: 150,
                weightOptions: makeWeightOptions(basePrice, 'weight-g'),
                rating: (Math.random() * (5 - 4.3) + 4.3).toFixed(1),
                numReviews: Math.floor(Math.random() * 2000) + 500,
                nutrition: {
                    calories: Math.floor(Math.random() * 400) + 150,
                    protein: (Math.random() * 8).toFixed(1),
                    carbs: (Math.random() * 40).toFixed(1),
                    fat: (Math.random() * 20).toFixed(1)
                },
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

        beverages.forEach((name, i) => {
            const isPowder = name.toLowerCase().includes('powder') || name.toLowerCase().includes('beans') || name.toLowerCase().includes('premix');
            const basePrice = Math.floor(Math.random() * 200) + 20;
            products.push({
                name,
                description: `Refreshing ${name.toLowerCase()}. Quench your thirst with premium quality. Best served chilled.`,
                price: basePrice,
                image: `https://loremflickr.com/600/600/beverage,${name.toLowerCase().replace(/ /g, '')}`,
                additionalImages: [
                    `https://loremflickr.com/600/600/beverage,${name.toLowerCase().replace(/ /g, '')},glass`,
                    `https://loremflickr.com/600/600/beverage,${name.toLowerCase().replace(/ /g, '')},can`
                ],
                category: 'Beverages',
                unit: isPowder ? 'g' : 'ml',
                quantity: isPowder ? 200 : 300,
                weightOptions: isPowder
                    ? makeWeightOptions(basePrice, 'weight-g')
                    : makeWeightOptions(basePrice, 'weight-ml'),
                rating: (Math.random() * (5 - 3.9) + 3.9).toFixed(1),
                numReviews: Math.floor(Math.random() * 1500) + 100,
                nutrition: {
                    calories: Math.floor(Math.random() * 150),
                    protein: (Math.random() * 1).toFixed(1),
                    carbs: (Math.random() * 25).toFixed(1),
                    fat: 0
                },
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

        personalCare.forEach((name, i) => {
            const basePrice = Math.floor(Math.random() * 600) + 50;
            products.push({
                name,
                description: `Gentle and effective ${name.toLowerCase()}. Dermatologically tested for your daily wellness.`,
                price: basePrice,
                image: `https://loremflickr.com/600/600/personalcare,${name.toLowerCase().replace(/ /g, '')}`,
                additionalImages: [
                    `https://loremflickr.com/600/600/personalcare,${name.toLowerCase().replace(/ /g, '')},bottle`,
                    `https://loremflickr.com/600/600/personalcare,${name.toLowerCase().replace(/ /g, '')},use`
                ],
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

        console.log(`Inserting ${products.length} products with dynamic pricing...`);
        const createdProducts = await Product.insertMany(products);
        console.log('Products inserted successfully!');

        // --- RECIPE GENERATION ---
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

        const recipes = [];
        indianRecipes.forEach(recipe => {
            const recipeIngredients = [];
            const numIngredients = 5;
            const baseProduct = createdProducts.find(p => p.name.toLowerCase().includes(recipe.base.toLowerCase()));
            if (baseProduct) {
                recipeIngredients.push({
                    product: baseProduct._id,
                    quantityPerServing: 100,
                    unit: baseProduct.unit
                });
            }
            while (recipeIngredients.length < numIngredients) {
                const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
                if (!recipeIngredients.find(ri => ri.product.toString() === randomProduct._id.toString())) {
                    recipeIngredients.push({
                        product: randomProduct._id,
                        quantityPerServing: 50,
                        unit: randomProduct.unit
                    });
                }
            }
            recipes.push({
                name: recipe.name,
                image: `https://loremflickr.com/800/600/indianfood,${recipe.name.toLowerCase().replace(/ /g, '')}`,
                cookingTime: recipe.time,
                servings: 4,
                category: 'Indian',
                instructions: [
                    'Sauté your base aromatics (onion, garlic, ginger) in oil.',
                    'Add your main vegetables or protein.',
                    'Stir in premium spices and simmer.',
                    'Add salt to taste and garnish with fresh herbs.'
                ],
                ingredients: recipeIngredients
            });
        });

        await Recipe.insertMany(recipes);
        console.log('Recipes inserted based on new products!');
        console.log('Database Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error('Error during refined seeding:', error);
        process.exit(1);
    }
};

seedDB();
