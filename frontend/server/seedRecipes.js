require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

const recipes = [
    {
        name: 'Paneer Butter Masala',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80',
        cookingTime: 35,
        servings: 4,
        calories: 420,
        difficulty: 'Medium',
        category: 'Main Course',
        ingredients: [
            { name: 'Paneer', quantityPerServing: 100, unit: 'g' },
            { name: 'Tomato', quantityPerServing: 3, unit: 'pcs' },
            { name: 'Butter', quantityPerServing: 30, unit: 'g' },
            { name: 'Cream', quantityPerServing: 50, unit: 'ml' },
            { name: 'Onion', quantityPerServing: 2, unit: 'pcs' },
            { name: 'Ginger Garlic Paste', quantityPerServing: 15, unit: 'g' },
            { name: 'Kashmiri Chilli Powder', quantityPerServing: 5, unit: 'g' },
            { name: 'Garam Masala', quantityPerServing: 3, unit: 'g' },
        ],
        instructions: [
            'Cut paneer into cubes and lightly fry until golden on each side. Set aside.',
            'Blanch tomatoes, peel and blend to a smooth puree.',
            'Heat butter in a pan, add onions and sauté until golden brown.',
            'Add ginger garlic paste and cook until raw smell disappears.',
            'Add tomato puree, Kashmiri chilli powder, and cook on medium heat for 10 minutes.',
            'Add cream and garam masala, stir well and simmer for 5 minutes.',
            'Add fried paneer cubes, cook for 3 more minutes.',
            'Garnish with fresh cream and coriander. Serve hot with naan or rice.',
        ],
    },
    {
        name: 'Masala Dosa',
        image: 'https://t3.ftcdn.net/jpg/16/04/12/46/360_F_1604124629_CZx2NS0GzspqNEc8q9xGMIdy8CcQ8y7W.jpg',
        cookingTime: 45,
        servings: 4,
        calories: 280,
        difficulty: 'Hard',
        category: 'Breakfast',
        ingredients: [
            { name: 'Rice', quantityPerServing: 150, unit: 'g' },
            { name: 'Urad Dal', quantityPerServing: 50, unit: 'g' },
            { name: 'Potato', quantityPerServing: 200, unit: 'g' },
            { name: 'Onion', quantityPerServing: 1, unit: 'pcs' },
            { name: 'Mustard Seeds', quantityPerServing: 5, unit: 'g' },
            { name: 'Curry Leaves', quantityPerServing: 8, unit: 'pcs' },
            { name: 'Turmeric Powder', quantityPerServing: 3, unit: 'g' },
        ],
        instructions: [
            'Soak rice and urad dal separately for 8 hours or overnight.',
            'Grind to a smooth batter, mix together, and ferment for 12 hours.',
            'Boil potatoes, peel and mash coarsely.',
            'Heat oil, add mustard seeds, curry leaves, chopped onions and sauté.',
            'Add turmeric, salt, and mashed potatoes. Mix well for the filling.',
            'Heat a flat tawa, pour a ladle of batter and spread in circular motion.',
            'Drizzle oil around edges, cook until golden and crispy.',
            'Place potato filling on one side, fold and serve with chutney and sambar.',
        ],
    },
    {
        name: 'Greek Salad',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
        cookingTime: 10,
        servings: 2,
        calories: 180,
        difficulty: 'Easy',
        category: 'Snacks',
        ingredients: [
            { name: 'Cucumber', quantityPerServing: 1, unit: 'pcs' },
            { name: 'Tomato', quantityPerServing: 2, unit: 'pcs' },
            { name: 'Red Onion', quantityPerServing: 1, unit: 'pcs' },
            { name: 'Feta Cheese', quantityPerServing: 80, unit: 'g' },
            { name: 'Kalamata Olives', quantityPerServing: 50, unit: 'g' },
            { name: 'Olive Oil', quantityPerServing: 30, unit: 'ml' },
            { name: 'Oregano', quantityPerServing: 2, unit: 'g' },
        ],
        instructions: [
            'Wash and chop cucumber, tomatoes, and red onion into large chunks.',
            'Add kalamata olives and crumbled feta cheese to the bowl.',
            'Drizzle generously with extra virgin olive oil.',
            'Season with dried oregano, salt, and pepper.',
            'Toss gently and serve immediately.',
        ],
    },
    {
        name: 'Spaghetti Aglio e Olio',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
        cookingTime: 20,
        servings: 2,
        calories: 380,
        difficulty: 'Easy',
        category: 'Main Course',
        ingredients: [
            { name: 'Spaghetti', quantityPerServing: 200, unit: 'g' },
            { name: 'Garlic', quantityPerServing: 8, unit: 'cloves' },
            { name: 'Olive Oil', quantityPerServing: 60, unit: 'ml' },
            { name: 'Red Chilli Flakes', quantityPerServing: 5, unit: 'g' },
            { name: 'Parsley', quantityPerServing: 15, unit: 'g' },
            { name: 'Parmesan', quantityPerServing: 30, unit: 'g' },
        ],
        instructions: [
            'Boil spaghetti in salted water until al dente. Reserve 1 cup pasta water.',
            'Slice garlic thinly. Heat olive oil in a large pan on low heat.',
            'Add sliced garlic and cook slowly until light golden (do not burn).',
            'Add red chilli flakes and toss for 30 seconds.',
            'Add drained spaghetti and a splash of pasta water to the pan.',
            'Toss vigorously until the sauce emulsifies and coats the pasta.',
            'Add chopped parsley, season with salt, and finish with parmesan.',
        ],
    },
    {
        name: 'Mango Lassi',
        image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80',
        cookingTime: 5,
        servings: 2,
        calories: 220,
        difficulty: 'Easy',
        category: 'Beverages',
        ingredients: [
            { name: 'Ripe Mango', quantityPerServing: 1, unit: 'pcs' },
            { name: 'Yogurt', quantityPerServing: 200, unit: 'ml' },
            { name: 'Milk', quantityPerServing: 100, unit: 'ml' },
            { name: 'Sugar', quantityPerServing: 20, unit: 'g' },
            { name: 'Cardamom', quantityPerServing: 2, unit: 'pcs' },
        ],
        instructions: [
            'Peel and chop ripe mango into chunks.',
            'Add mango, yogurt, milk, and sugar to a blender.',
            'Blend until smooth and creamy.',
            'Add crushed cardamom and blend for 5 more seconds.',
            'Pour into glasses and serve chilled with a mango slice garnish.',
        ],
    },
    {
        name: 'Gulab Jamun',
        image: 'https://media.istockphoto.com/id/163064596/photo/gulab-jamun.jpg?s=612x612&w=0&k=20&c=JvJ4AAs-N5pRzzRmVg1lG0talC3QoUt0ZGiO1NKz-kQ=',
        cookingTime: 40,
        servings: 6,
        calories: 350,
        difficulty: 'Medium',
        category: 'Desserts',
        ingredients: [
            { name: 'Khoya / Mawa', quantityPerServing: 200, unit: 'g' },
            { name: 'Maida (Flour)', quantityPerServing: 30, unit: 'g' },
            { name: 'Baking Soda', quantityPerServing: 1, unit: 'pinch' },
            { name: 'Sugar', quantityPerServing: 300, unit: 'g' },
            { name: 'Saffron', quantityPerServing: 4, unit: 'strands' },
            { name: 'Cardamom', quantityPerServing: 3, unit: 'pcs' },
            { name: 'Rose Water', quantityPerServing: 10, unit: 'ml' },
        ],
        instructions: [
            'Crumble khoya and knead with maida and a pinch of baking soda into a smooth dough.',
            'Make the sugar syrup: boil sugar with water, add cardamom and saffron.',
            'Let syrup reach one-string consistency, add rose water and keep warm.',
            'Shape dough into smooth balls without any cracks.',
            'Heat oil on low flame and fry the balls slowly, turning gently, until deep golden brown.',
            'Immediately drop fried balls into warm sugar syrup.',
            'Let them soak for at least 2 hours before serving. Serve warm or cold.',
        ],
    },
    {
        name: 'Chole Bhature',
        image: 'https://t4.ftcdn.net/jpg/18/75/82/69/360_F_1875826968_LVmbaHtx2uVMniXiBcmNBXneJcz74wQd.jpg',
        cookingTime: 50,
        servings: 4,
        calories: 520,
        difficulty: 'Hard',
        category: 'Main Course',
        ingredients: [
            { name: 'Chickpeas', quantityPerServing: 250, unit: 'g' },
            { name: 'Onion', quantityPerServing: 2, unit: 'pcs' },
            { name: 'Tomato', quantityPerServing: 3, unit: 'pcs' },
            { name: 'Maida (Flour)', quantityPerServing: 200, unit: 'g' },
            { name: 'Yogurt', quantityPerServing: 50, unit: 'ml' },
            { name: 'Tea Bags', quantityPerServing: 2, unit: 'pcs' },
            { name: 'Chole Masala', quantityPerServing: 15, unit: 'g' },
        ],
        instructions: [
            'Soak chickpeas overnight. Boil with tea bags for dark color until tender.',
            'For bhature: Mix maida, yogurt, salt, sugar, oil. Knead soft dough and rest 2 hours.',
            'Sauté onions until golden, add ginger-garlic paste and tomato puree.',
            'Add chole masala, turmeric, and cook until oil separates.',
            'Add boiled chickpeas with some water and simmer for 20 minutes.',
            'Roll out bhature dough into oval shapes.',
            'Deep fry until puffed and golden brown. Serve hot with chole.',
        ],
    },
    {
        name: 'Avocado Toast',
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&q=80',
        cookingTime: 10,
        servings: 2,
        calories: 290,
        difficulty: 'Easy',
        category: 'Breakfast',
        ingredients: [
            { name: 'Avocado', quantityPerServing: 1, unit: 'pcs' },
            { name: 'Sourdough Bread', quantityPerServing: 2, unit: 'slices' },
            { name: 'Lemon', quantityPerServing: 1, unit: 'pcs' },
            { name: 'Cherry Tomatoes', quantityPerServing: 6, unit: 'pcs' },
            { name: 'Red Chilli Flakes', quantityPerServing: 2, unit: 'g' },
            { name: 'Olive Oil', quantityPerServing: 10, unit: 'ml' },
        ],
        instructions: [
            'Toast sourdough bread slices until golden and crispy.',
            'Halve avocado, remove pit, scoop flesh into a bowl.',
            'Mash with a fork, add lemon juice, salt, and pepper.',
            'Spread generously on toast.',
            'Top with halved cherry tomatoes, chilli flakes, and a drizzle of olive oil.',
        ],
    },
];

async function seedRecipes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        await Recipe.deleteMany({});
        console.log('Cleared existing recipes');
        await Recipe.insertMany(recipes);
        console.log(`Seeded ${recipes.length} recipes!`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedRecipes();
