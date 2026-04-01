import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Minus, Plus, ChevronRight, Edit3, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleFavorite } from '../redux/slices/favoritesSlice';
import { Skeleton } from '../components/common/Skeleton';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { favoriteIds } = useSelector((state) => state.favorites);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [selectedWeight, setSelectedWeight] = useState(null); // now an object {label, price}
    const [activeImage, setActiveImage] = useState('');
    const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'description'

    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user?.token) {
            toast.error('Please login to write a review');
            return;
        }

        setIsSubmitting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/products/${id}/reviews`, { rating: userRating, comment: userComment }, config);
            toast.success('Review submitted successfully!');
            setShowReviewForm(false);
            setUserComment('');
            // Refresh product data
            const { data } = await axios.get(`/api/products/${id}`);
            setProduct(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting review');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                setActiveImage(data.image);
                if (data.weightOptions && data.weightOptions.length > 0) {
                    setSelectedWeight(data.weightOptions[0]); // {label, price}
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Use the selected weight's price, fallback to product base price
    const activePrice = selectedWeight?.price ?? product?.price ?? 0;

    const handleAddToCart = () => {
        dispatch(addToCart({
            ...product,
            price: activePrice,
            qty,
            selectedWeight: selectedWeight?.label || ''
        }));
    };

    if (loading) {
        return (
            <div className="pt-32 pb-20 container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12">
                    <Skeleton className="w-full md:w-1/2 aspect-square rounded-[3.5rem]" />
                    <div className="w-full md:w-1/2 space-y-6">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-16 w-1/2" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return <div className="pt-40 text-center">Product not found</div>;

    const ratingData = [
        { stars: 5, percentage: 80 },
        { stars: 4, percentage: 65 },
        { stars: 3, percentage: 30 },
        { stars: 2, percentage: 10 },
        { stars: 1, percentage: 5 },
    ];

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/cart');
    };

    return (
        <div className="pt-28 pb-32 bg-white min-h-screen">
            <div className="container mx-auto px-6">
                {/* Header Information */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Shop</h1>
                    <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
                        <Link to="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link to="/shop" className="hover:text-primary">Shop</Link>
                    </div>
                </div>

                {/* Main Product Section */}
                <div className="flex flex-col lg:flex-row gap-16 mb-24">
                    {/* Left: Image Gallery */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        <div className="bg-[#F8F9FB] rounded-[3.5rem] p-12 aspect-square flex items-center justify-center relative overflow-hidden group">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    src={activeImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-4 px-2">
                            {[product.image, ...(product.additionalImages || [])].map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-28 h-28 rounded-3xl p-3 border-2 transition-all overflow-hidden ${activeImage === img ? 'border-primary bg-white shadow-xl shadow-green-50' : 'border-transparent bg-slate-50 opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-contain" alt="thumbnail" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="w-full lg:w-1/2 space-y-10 py-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-primary font-bold text-sm tracking-wide">{product.category}</span>
                                <span className="px-3 py-1 bg-green-50 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/10">
                                    In Stock
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <h2 className="text-5xl font-black text-slate-900 leading-tight">{product.name}</h2>
                                <motion.button
                                    whileTap={{ scale: 0.75 }}
                                    onClick={() => {
                                        if (!user) return navigate('/login');
                                        dispatch(toggleFavorite(product._id));
                                    }}
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${favoriteIds.includes(product._id)
                                        ? 'bg-red-50 text-red-500 shadow-lg shadow-red-100'
                                        : 'bg-slate-50 text-slate-300 hover:text-red-400'
                                        }`}
                                >
                                    <Heart className={`w-7 h-7 transition-all duration-300 ${favoriteIds.includes(product._id) ? 'fill-current' : ''}`} />
                                </motion.button>
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <motion.span
                                    key={activePrice}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl font-black text-slate-900"
                                >
                                    ₹{activePrice.toFixed(2)}
                                </motion.span>
                                <span className="text-2xl text-slate-300 line-through">₹{(activePrice * 1.25).toFixed(2)}</span>
                                {selectedWeight && (
                                    <span className="px-3 py-1 bg-green-50 text-primary text-xs font-bold rounded-lg">
                                        {selectedWeight.label}
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
                            {product.description}
                        </p>

                        {/* Weight / Size Selection */}
                        <div className="space-y-4">
                            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Size</p>
                            <div className="flex flex-wrap gap-3">
                                {(product.weightOptions || []).map((opt, idx) => {
                                    // Support both old string format and new {label, price} format
                                    const label = typeof opt === 'string' ? opt : opt.label;
                                    const price = typeof opt === 'string' ? product.price : opt.price;
                                    const isActive = selectedWeight?.label === label;

                                    return (
                                        <button
                                            key={label}
                                            onClick={() => setSelectedWeight({ label, price })}
                                            className={`px-6 py-3 rounded-2xl font-bold transition-all border-2 flex flex-col items-center min-w-[100px] ${isActive
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-green-100'
                                                : 'bg-white border-slate-100 text-slate-600 hover:border-primary/30'
                                                }`}
                                        >
                                            <span className="text-sm">{label}</span>
                                            <span className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-primary font-black'}`}>
                                                ₹{price}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex flex-wrap items-center gap-6 pt-6">
                            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1.5">
                                <button
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="w-10 text-center font-black text-xl text-slate-800">{qty}</span>
                                <button
                                    onClick={() => setQty(qty + 1)}
                                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-primary text-white py-5 px-8 rounded-[1.8rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-green-200 hover:scale-[1.02] transition-transform"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                Add to cart
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="bg-[#FFCC29] text-white py-5 px-10 rounded-[1.8rem] font-black text-lg shadow-2xl shadow-yellow-100 hover:scale-[1.02] transition-transform"
                            >
                                Buy now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Tabs Selection */}
                <div className="border-b border-slate-100 mb-12">
                    <div className="flex gap-12">
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-6 text-2xl font-black transition-all relative ${activeTab === 'reviews' ? 'text-slate-900 border-b-4 border-slate-900' : 'text-slate-300'
                                }`}
                        >
                            Rating & Reviews
                        </button>
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`pb-6 text-2xl font-black transition-all relative ${activeTab === 'description' ? 'text-slate-900 border-b-4 border-slate-900' : 'text-slate-300'
                                }`}
                        >
                            Description
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'reviews' ? (
                        <div className="flex flex-col md:flex-row gap-20">
                            {/* Summary */}
                            <div className="w-full md:w-1/3">
                                <div className="space-y-8">
                                    <div className="flex items-end gap-3">
                                        <h3 className="text-6xl font-black text-slate-900">{product.rating ? product.rating.toFixed(1) : '0.0'}</h3>
                                        <div className="pb-2">
                                            <p className="text-slate-400 font-bold">out of 5</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400 gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star
                                                key={i}
                                                className={`w-6 h-6 ${i <= Math.round(product.rating || 0) ? 'fill-current' : 'text-slate-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-slate-400 font-medium">({product.numReviews || 0} Reviews)</p>

                                    {/* Bar Chart */}
                                    <div className="space-y-4 pt-4">
                                        {[5, 4, 3, 2, 1].map((stars) => {
                                            const count = product.reviews?.filter(r => r.rating === stars).length || 0;
                                            const pct = product.numReviews > 0 ? (count / product.numReviews) * 100 : 0;
                                            return (
                                                <div key={stars} className="flex items-center gap-4">
                                                    <span className="text-sm font-bold text-slate-600 w-12">{stars} Star</span>
                                                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            className="h-full bg-yellow-400"
                                                        />
                                                    </div>
                                                    <span className="text-xs font-black text-slate-400 w-8">{Math.round(pct)}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Review Form / CTA */}
                            <div className="flex-1">
                                <AnimatePresence mode="wait">
                                    {!showReviewForm ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[3rem] border border-slate-100 text-center h-full"
                                        >
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                                                <Edit3 className="w-8 h-8 text-primary" />
                                            </div>
                                            <h4 className="text-3xl font-black text-slate-900 mb-4">Review this product</h4>
                                            <p className="text-slate-500 mb-8 max-w-xs">Share your thoughts with other customers and help them make better choices.</p>
                                            <button
                                                onClick={() => setShowReviewForm(true)}
                                                className="px-12 py-5 bg-white border-2 border-slate-200 rounded-[2rem] font-black text-slate-700 hover:border-primary hover:text-primary transition-all shadow-sm"
                                            >
                                                Write a customer review
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 h-full"
                                        >
                                            <form onSubmit={handleReviewSubmit} className="space-y-8">
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Rating</p>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => setUserRating(s)}
                                                                className="hover:scale-110 transition-transform"
                                                            >
                                                                <Star className={`w-10 h-10 ${s <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Comments</p>
                                                    <textarea
                                                        value={userComment}
                                                        onChange={(e) => setUserComment(e.target.value)}
                                                        className="w-full bg-white border-2 border-slate-100 rounded-3xl p-6 h-32 focus:border-primary outline-none transition-all font-medium text-slate-700"
                                                        placeholder="What did you like about this product?"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowReviewForm(false)}
                                                        className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-black text-slate-400 hover:text-slate-600 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-green-100 hover:scale-[1.02] transition-transform disabled:opacity-50"
                                                    >
                                                        {isSubmitting ? 'Posting...' : 'Submit Review'}
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-16">
                            <div className="w-full md:w-1/2 space-y-8">
                                <h4 className="text-3xl font-black text-slate-900 tracking-tight">Product Information</h4>
                                <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
                                    "{product.description}"
                                </p>
                                <div className="space-y-6 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-primary">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Quality Assurance</p>
                                            <p className="text-slate-500 text-sm">100% Organic and fresh from local farms.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                                            <Truck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Fast Delivery</p>
                                            <p className="text-slate-500 text-sm">Delivered to your doorstep within 10-30 minutes.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 bg-slate-50 rounded-[3rem] p-10 border border-slate-100">
                                <h4 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
                                    <Flame className="w-6 h-6 text-orange-500" /> Nutritional Facts
                                </h4>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                        <span className="text-lg font-bold text-slate-600">Calories</span>
                                        <span className="text-2xl font-black text-slate-900">{product.nutrition?.calories || 0} cal</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                        <span className="text-lg font-bold text-slate-600">Protein</span>
                                        <span className="text-2xl font-black text-slate-900">{product.nutrition?.protein || 0}g</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                        <span className="text-lg font-bold text-slate-600">Carbohydrates</span>
                                        <span className="text-2xl font-black text-slate-900">{product.nutrition?.carbs || 0}g</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-600">Total Fat</span>
                                        <span className="text-2xl font-black text-slate-900">{product.nutrition?.fat || 0}g</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-10 text-center">
                                    * % Daily values are based on a 2,000 calorie diet.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Customer Stories / Reviews List */}
                    {activeTab === 'reviews' && (
                        <div className="max-w-4xl mx-auto mt-20 pt-20 border-t border-slate-50">
                            <h4 className="text-3xl font-black text-slate-900 mb-12 tracking-tight">Customer Stories</h4>
                            {product.reviews && product.reviews.length > 0 ? (
                                <div className="space-y-8">
                                    {product.reviews.map((review, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{review.name}</p>
                                                    <div className="flex gap-0.5 mt-1">
                                                        {[...Array(5)].map((_, idx) => (
                                                            <Star
                                                                key={idx}
                                                                className={`w-4 h-4 ${idx < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                                                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 leading-relaxed font-medium italic">"{review.comment}"</p>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                        <Star className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No stories yet. Be the first to share your experience!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
