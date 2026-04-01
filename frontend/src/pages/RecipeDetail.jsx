import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import axios from 'axios';
import { ChevronLeft, Clock, Flame, Users, ShoppingCart, ChefHat, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

const diffColor = { Easy: 'bg-green-100 text-green-700', Medium: 'bg-amber-100 text-amber-700', Hard: 'bg-red-100 text-red-700' };

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const { data } = await axios.get(`/api/recipes/${id}`);
                setRecipe(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);


    const handleAddAllIngredients = () => {
        if (!recipe?.ingredients) return;
        recipe.ingredients.forEach(ing => {
            dispatch(addToCart({
                _id: ing.product?._id || `ing-${recipe._id}-${ing.name}`,
                name: ing.name || ing.product?.name || 'Ingredient',
                price: ing.product?.price || Math.ceil(Math.random() * 40 + 10),
                image: recipe.image,
                qty: 1,
            }));
        });
        toast.success('All ingredients added to cart!');
    };

    if (loading) return (
        <div className="min-h-screen bg-[#F5F0E8] pt-32 flex items-center justify-center">
            <div className="animate-pulse text-stone-400 font-bold">Loading recipe...</div>
        </div>
    );

    if (!recipe) return (
        <div className="min-h-screen bg-[#F5F0E8] pt-32 flex items-center justify-center">
            <div className="text-stone-400 font-bold">Recipe not found</div>
        </div>
    );

    const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];
    const ingredients = recipe.ingredients || [];

    return (
        <div className="min-h-screen bg-[#F5F0E8] pt-28 pb-20">
            <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
                {/* Back */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => navigate('/recipes')}
                    className="flex items-center gap-2 text-stone-400 hover:text-primary mb-8 font-medium transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" /> Back to Kitchen
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left — Image */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-stone-300/50">
                            <img src={recipe.image} alt={recipe.name} className="w-full h-80 sm:h-96 object-cover" />
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                                <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                                <p className="text-lg font-black text-stone-800">{recipe.cookingTime}</p>
                                <p className="text-[10px] text-stone-400 font-bold uppercase">Minutes</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                                <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                                <p className="text-lg font-black text-stone-800">{recipe.calories || '---'}</p>
                                <p className="text-[10px] text-stone-400 font-bold uppercase">Calories</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                                <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                <p className="text-lg font-black text-stone-800">{recipe.servings}</p>
                                <p className="text-[10px] text-stone-400 font-bold uppercase">Servings</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Content */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${diffColor[recipe.difficulty] || diffColor.Medium}`}>
                                {recipe.difficulty}
                            </span>
                            {recipe.category && (
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    {recipe.category}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl font-black text-stone-900 mb-6 leading-tight">{recipe.name}</h1>

                        {/* Ingredients Card */}
                        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-stone-200/50 mb-8">
                            <h3 className="text-lg font-black text-stone-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" /> Ingredients
                            </h3>
                            <div className="space-y-2 mb-6">
                                {ingredients.map((ing, i) => (
                                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-stone-50 last:border-0">
                                        <span className="text-stone-700 text-sm font-medium">{ing.name || ing.product?.name || 'Ingredient'}</span>
                                        <span className="text-stone-400 text-xs font-bold tabular-nums">{ing.quantityPerServing} {ing.unit}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleAddAllIngredients}
                                className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-green-200"
                            >
                                <ShoppingCart className="w-4 h-4" /> Add All Ingredients to Cart
                            </button>
                        </div>

                        {/* Instructions Card */}
                        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-stone-200/50">
                            <h3 className="text-lg font-black text-stone-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <ChefHat className="w-5 h-5 text-primary" /> Instructions
                            </h3>
                            <div className="space-y-5">
                                {instructions.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex gap-4"
                                    >
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-primary text-xs font-black">{i + 1}</span>
                                        </div>
                                        <p className="text-stone-600 text-sm leading-relaxed font-medium flex-1">{step}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
