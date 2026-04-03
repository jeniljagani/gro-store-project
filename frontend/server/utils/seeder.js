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
        vegetables.forEach((name, i) => {
            const isLeafy = leafyVegs.includes(name) || name.includes('Leaves');
            const basePrice = Math.floor(Math.random() * 80) + 20;
            products.push({
                name,
                description: `Premium organic ${name.toLowerCase()}. Hand-picked and farm-fresh for superior taste and nutrition.`,
                price: basePrice,
                image: `https://loremflickr.com/600/600/vegetable,${name.toLowerCase().replace(/ /g, '')}`,
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
        fruits.forEach((name, i) => {
            const isBerry = ['Strawberry', 'Blueberry', 'Raspberry', 'Blackberry', 'Cherry', 'Grapes Green', 'Grapes Black'].includes(name);
            const basePrice = Math.floor(Math.random() * 150) + 40;
            products.push({
                name,
                description: `A grade ${name.toLowerCase()}. Exceptionally sweet, juicy and packed with natural vitamins.`,
                price: basePrice,
                image: `https://loremflickr.com/600/600/fruit,${name.toLowerCase().replace(/ /g, '')}`,
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
        dairy.forEach((name, i) => {
            const isLiquid = name.toLowerCase().includes('milk') || name.toLowerCase().includes('drink') || name.toLowerCase().includes('lassi') || name.toLowerCase().includes('buttermilk');
            const basePrice = Math.floor(Math.random() * 400) + 30;
            products.push({
                name,
                description: `Premium quality ${name.toLowerCase()}. Sourced from high-grade dairy farms.`,
                price: basePrice,
                image: `https://loremflickr.com/600/600/dairy,${name.toLowerCase().replace(/ /g, '')}`,
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
