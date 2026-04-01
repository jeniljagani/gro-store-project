import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Star, ArrowLeft, HeartOff } from 'lucide-react';
import { fetchFavorites, toggleFavorite } from '../redux/slices/favoritesSlice';
import { addToCart } from '../redux/slices/cartSlice';

const Favorites = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { items, isLoading, favoriteIds } = useSelector((state) => state.favorites);

    useEffect(() => {
        if (user?.token) {
            dispatch(fetchFavorites());
        }
    }, [dispatch, user]);

    if (!user) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-white">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Heart className="w-12 h-12 text-red-400" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Login to see your favorites</h2>
                        <p className="text-slate-500 mb-8">Sign in to save and view your favorite products.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:scale-105 transition-transform"
                        >
                            Sign In
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-32 min-h-screen bg-white">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary mb-6 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-100">
                            <Heart className="w-7 h-7 text-white fill-current" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900">My Favorites</h1>
                            <p className="text-slate-400 font-medium mt-1">
                                {items.length} {items.length === 1 ? 'item' : 'items'} saved
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Loading State */}
                {isLoading && items.length === 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-slate-100 rounded-3xl aspect-square mb-4" />
                                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-slate-100 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && items.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <HeartOff className="w-16 h-16 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3">No favorites yet</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mb-8">
                            Start exploring and tap the heart icon on products you love to add them here.
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:scale-105 transition-transform"
                        >
                            Browse Products
                        </button>
                    </motion.div>
                )}

                {/* Products Grid */}
                <AnimatePresence>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {items.map((product, idx) => (
                            <motion.div
                                key={product._id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group"
                            >
                                <div
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    className="bg-white border border-slate-100 rounded-[2.5rem] p-6 cursor-pointer hover:shadow-2xl hover:shadow-slate-100 hover:border-primary/10 transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square mb-6 bg-slate-50 rounded-3xl overflow-hidden p-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {/* Remove button */}
                                        <motion.button
                                            whileTap={{ scale: 0.75 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(toggleFavorite(product._id));
                                            }}
                                            className="absolute top-4 right-4 w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-50 hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                {product.category}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {product.rating || '4.9'}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center justify-between pt-2">
                                            <div>
                                                <p className="text-xl font-black text-slate-900">
                                                    ₹{product.price?.toFixed(2)}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold">
                                                    {product.quantity}{product.unit}
                                                </p>
                                            </div>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch(addToCart({ ...product, qty: 1 }));
                                                }}
                                                className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Favorites;
