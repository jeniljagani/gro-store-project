import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart, LayoutGrid, List, Search,
    ChevronDown, Truck, Leaf, Clock, Star,
    Package, ArrowRight
} from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/common/Skeleton';

// ==============================
// CATEGORY CONFIG
// ==============================
const categories = [
    {
        key: 'Fresh Vegetables', slug: 'vegetables', label: 'Vegetables',
        emoji: '🥦', color: 'from-green-500 to-emerald-600',
        bg: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200',
        heroGradient: 'from-green-50 via-emerald-50/50 to-white',
        floatingEmojis: ['🥬', '🥕', '🍅', '🌽', '🫑'],
        desc: 'Explore the finest selection of organic fresh vegetables curated for your health.',
    },
    {
        key: 'Fruits', slug: 'fruits', label: 'Fruits',
        emoji: '🍎', color: 'from-red-500 to-orange-600',
        bg: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200',
        heroGradient: 'from-red-50 via-orange-50/50 to-white',
        floatingEmojis: ['🍇', '🍊', '🍋', '🫐', '🍌'],
        desc: 'Sweet, juicy, and packed with natural vitamins — hand-picked daily.',
    },
    {
        key: 'Dairy', slug: 'dairy', label: 'Dairy',
        emoji: '🥛', color: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200',
        heroGradient: 'from-blue-50 via-sky-50/50 to-white',
        floatingEmojis: ['🧀', '🧈', '🥚', '🍦', '🥛'],
        desc: 'Farm-fresh dairy essentials — milk, cheese, paneer, and more.',
    },
    {
        key: 'Snacks', slug: 'snacks', label: 'Snacks',
        emoji: '🍿', color: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200',
        heroGradient: 'from-amber-50 via-orange-50/50 to-white',
        floatingEmojis: ['🍪', '🍫', '🥜', '🧁', '🍿'],
        desc: 'Irresistible treats for every mood and every craving.',
    },
    {
        key: 'Beverages', slug: 'beverages', label: 'Beverages',
        emoji: '🧃', color: 'from-purple-500 to-violet-600',
        bg: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200',
        heroGradient: 'from-purple-50 via-violet-50/50 to-white',
        floatingEmojis: ['☕', '🍵', '🥤', '🧃', '🍹'],
        desc: 'Stay hydrated and energized with our premium drink selection.',
    },
    {
        key: 'Personal Care', slug: 'care', label: 'Personal Care',
        emoji: '✨', color: 'from-pink-500 to-rose-600',
        bg: 'bg-pink-50', textColor: 'text-pink-700', borderColor: 'border-pink-200',
        heroGradient: 'from-pink-50 via-rose-50/50 to-white',
        floatingEmojis: ['🧴', '🪥', '🧼', '💆', '✨'],
        desc: 'Premium personal care products for your daily wellness routine.',
    },
];

const features = [
    { icon: Truck, label: 'Free Delivery', desc: 'Orders above ₹499' },
    { icon: Leaf, label: 'Organic Certified', desc: '100% Natural' },
    { icon: Clock, label: 'Fresh Daily', desc: 'Farm to Door' },
    { icon: Star, label: 'Top Quality', desc: '5-Star Rated' },
];

// ==============================
// FLOATING EMOJI
// ==============================
const FloatingEmoji = ({ emoji, index }) => {
    const positions = [
        { top: '10%', right: '5%' },
        { top: '25%', right: '18%' },
        { top: '50%', right: '8%' },
        { top: '65%', right: '22%' },
        { top: '35%', right: '30%' },
    ];
    const pos = positions[index % positions.length];

    return (
        <motion.div
            className="absolute text-5xl md:text-7xl select-none pointer-events-none z-0"
            style={pos}
            animate={{
                y: [0, -15, 0, 10, 0],
                x: [0, 8, 0, -5, 0],
                rotate: [0, 5, -3, 2, 0],
            }}
            transition={{
                duration: 5 + index,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.5,
            }}
        >
            {emoji}
        </motion.div>
    );
};

// ==============================
// MAIN SHOP COMPONENT
// ==============================
const Shop = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const productsRef = useRef(null);

    const initialCat = searchParams.get('category') || 'Fresh Vegetables';
    const [selectedCategory, setSelectedCategory] = useState(initialCat);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [view, setView] = useState('grid');

    const activeCat = categories.find(c => c.key === selectedCategory) || categories[0];

    // Fetch products when category or keyword changes
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                params.set('category', selectedCategory);
                if (keyword) params.set('keyword', keyword);

                const { data } = await axios.get(`/api/products?${params.toString()}`);
                setProducts(data.products || []);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory, keyword]);

    const handleCategoryChange = (catKey) => {
        setSelectedCategory(catKey);
        setKeyword('');
    };

    const scrollToProducts = () => {
        productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white pt-20">

            {/* ============================================ */}
            {/* CATEGORY TABS */}
            {/* ============================================ */}
            <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => handleCategoryChange(cat.key)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 ${selectedCategory === cat.key
                                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-${cat.slug === 'vegetables' ? 'green' : cat.slug === 'fruits' ? 'red' : 'slate'}-200 scale-105`
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                <span className="text-lg">{cat.emoji}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* PREMIUM HERO SECTION */}
            {/* ============================================ */}
            <AnimatePresence mode="wait">
                <motion.section
                    key={selectedCategory}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`relative bg-gradient-to-br ${activeCat.heroGradient} overflow-hidden`}
                >
                    <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* LEFT — Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative z-10"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.1 }}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${activeCat.bg} ${activeCat.textColor} border ${activeCat.borderColor} mb-6`}
                                >
                                    <span className="text-xl">{activeCat.emoji}</span>
                                    <span className="font-bold text-xs uppercase tracking-widest">{activeCat.label}</span>
                                </motion.div>

                                <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[0.9] tracking-tight">
                                    Fresh<br />
                                    <span className={`bg-gradient-to-r ${activeCat.color} bg-clip-text text-transparent`}>
                                        {activeCat.label}
                                    </span>
                                </h1>

                                <p className="text-lg text-slate-500 font-medium max-w-md mb-10 leading-relaxed">
                                    {activeCat.desc}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(22,163,74,0.3)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={scrollToProducts}
                                        className={`px-8 py-4 bg-gradient-to-r ${activeCat.color} text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl flex items-center gap-2`}
                                    >
                                        Browse Products <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/recipes')}
                                        className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg hover:border-slate-300"
                                    >
                                        View Recipes
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* RIGHT — Floating Emojis */}
                            <div className="relative h-64 md:h-80 lg:h-96 hidden md:block">
                                {activeCat.floatingEmojis.map((emoji, i) => (
                                    <FloatingEmoji key={`${selectedCategory}-${i}`} emoji={emoji} index={i} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <motion.button
                        onClick={scrollToProducts}
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={`absolute bottom-6 right-8 w-12 h-12 rounded-full bg-gradient-to-br ${activeCat.color} text-white shadow-xl flex items-center justify-center z-20`}
                    >
                        <ChevronDown className="w-6 h-6" />
                    </motion.button>

                    {/* Decorative blur shapes */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full blur-3xl" />
                </motion.section>
            </AnimatePresence>

            {/* ============================================ */}
            {/* FEATURE STRIP */}
            {/* ============================================ */}
            <div className="bg-white border-y border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 py-5 px-4 md:px-6 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <f.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-800">{f.label}</p>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* PRODUCTS SECTION */}
            {/* ============================================ */}
            <section ref={productsRef} className="py-12 md:py-20 bg-slate-50/50">
                <div className="container mx-auto px-6 md:px-12">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                                {activeCat.emoji} {activeCat.label}
                            </h2>
                            <p className="text-sm text-slate-400 font-medium mt-1">
                                Showing {loading ? '...' : products.length} products
                            </p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative flex-grow md:w-72">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm font-medium"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            </div>

                            {/* View Toggle */}
                            <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setView('grid')}
                                    className={`p-3 transition-all ${view === 'grid' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={`p-3 transition-all ${view === 'list' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                                <Package className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">No products found</h3>
                            <p className="text-slate-400 font-medium max-w-sm mx-auto mb-6">
                                {keyword
                                    ? `No results for "${keyword}" in ${activeCat.label}. Try a different search.`
                                    : `We're restocking ${activeCat.label}! Check back soon.`
                                }
                            </p>
                            {keyword && (
                                <button
                                    onClick={() => setKeyword('')}
                                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm"
                                >
                                    Clear Search
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={selectedCategory + keyword}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className={view === 'grid'
                                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
                                    : 'space-y-4 max-w-5xl mx-auto'
                                }
                            >
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(index * 0.03, 0.3) }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Shop;
