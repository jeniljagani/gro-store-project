import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProductSkeleton } from '../components/common/Skeleton';
import ProductCard from '../components/product/ProductCard';
import { motion } from 'framer-motion';
import { ChevronRight, Filter, LayoutGrid, List } from 'lucide-react';

const CategoryPage = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Normalizing category search for API
                const searchName = name.toLowerCase();
                const catMap = {
                    'vegetables': 'Fresh Vegetables',
                    'fruits': 'Fruits',
                    'dairy': 'Dairy',
                    'snacks': 'Snacks',
                    'beverages': 'Beverages',
                    'care': 'Personal Care'
                };

                const targetCategory = catMap[searchName] || name;
                const { data } = await axios.get(`/api/products?category=${targetCategory}`);

                setProducts(data.products);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [name]);

    const categoryMetaData = {
        vegetables: { color: 'from-green-400 to-emerald-600', icon: '🥦', desc: 'Crisp, organic, and harvested daily just for you.' },
        fruits: { color: 'from-orange-400 to-red-600', icon: '🍎', desc: 'Sweet, juicy, and packed with natural vitamins.' },
        dairy: { color: 'from-blue-400 to-indigo-600', icon: '🥛', desc: 'Farm-fresh milk, cheese, and dairy essentials.' },
        snacks: { color: 'from-amber-400 to-orange-600', icon: '🍪', desc: 'Delicious treats for every craving and mood.' },
        beverages: { color: 'from-purple-400 to-fuchsia-600', icon: '🥤', desc: 'Refreshing drinks to keep you hydrated and energized.' },
        care: { color: 'from-pink-400 to-rose-600', icon: '🧴', desc: 'Premium personal care for your daily wellness.' }
    };

    const meta = categoryMetaData[name.toLowerCase()] || { color: 'from-primary to-green-700', icon: '🌿', desc: 'Explore our premium selection.' };

    return (
        <div className="pt-28 pb-32 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-6">
                {/* Premium Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative rounded-[3rem] p-12 md:p-20 mb-16 overflow-hidden bg-gradient-to-br ${meta.color} text-white shadow-2xl`}
                >
                    <div className="relative z-10 max-w-2xl">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-4xl mb-8"
                        >
                            {meta.icon}
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 capitalize tracking-tight">{name}</h1>
                        <p className="text-white/80 text-xl md:text-2xl font-medium leading-relaxed">
                            {meta.desc}
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-20"></div>
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-10 right-10 flex gap-4 opacity-20">
                        <LayoutGrid className="w-24 h-24" />
                    </div>
                </motion.div>

                {/* Filter & View Bar */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Fresh Results</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                            Showing {products.length} Premium {name}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductSkeleton key={i} />)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="glass rounded-[3rem] p-24 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">📦</div>
                        <h2 className="text-3xl font-black text-slate-800 mb-4">No Items Found</h2>
                        <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">We're restocking our fresh {name}! Check back in a few hours or explore other categories.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="btn-primary py-4 px-10 rounded-[2rem]"
                        >
                            Go to Shop
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
