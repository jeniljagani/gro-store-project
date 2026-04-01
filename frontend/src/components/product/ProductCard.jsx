import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleFavorite } from '../../redux/slices/favoritesSlice';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { favoriteIds } = useSelector((state) => state.favorites);

    const isFavorite = favoriteIds.includes(product._id);

    const toggleFavoriteHandler = (e) => {
        e.stopPropagation();
        if (!user) return navigate('/login');
        dispatch(toggleFavorite(product._id));
    };

    const addToCartHandler = (e) => {
        e.stopPropagation();
        dispatch(addToCart({ ...product, qty: 1 }));
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            onClick={() => navigate(`/product/${product._id}`)}
            className="glass p-6 rounded-[2.5rem] group cursor-pointer border border-transparent hover:border-primary/20 transition-all"
        >
            <div className="relative aspect-square mb-6 bg-slate-50 rounded-3xl overflow-hidden p-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
                <motion.button
                    whileTap={{ scale: 0.75 }}
                    onClick={toggleFavoriteHandler}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isFavorite
                            ? 'bg-red-50 text-red-500 shadow-lg shadow-red-100'
                            : 'glass text-slate-400 hover:text-red-400'
                        }`}
                >
                    <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-current scale-110' : ''}`} />
                </motion.button>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.category}</span>
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-[10px] font-bold text-slate-400">{product.rating || '4.9'}</span>
                    </div>
                </div>
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                <div className="flex items-center justify-between pt-2">
                    <div>
                        <p className="text-xl font-black text-slate-900">₹{product.price?.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{product.quantity}{product.unit}</p>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={addToCartHandler}
                        className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
