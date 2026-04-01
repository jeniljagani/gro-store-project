import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Play, Star, ChevronRight, Zap, ShieldCheck, Truck, Leaf, Award } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';

const Home = () => {
    const navigate = useNavigate();

    const categories = [
        { name: 'Vegetables', icon: '🥦', color: 'bg-green-50', link: '/category/vegetables', emoji: '🥦' },
        { name: 'Fruits', icon: '🍎', color: 'bg-red-50', link: '/category/fruits', emoji: '🍎' },
        { name: 'Dairy', icon: '🥛', color: 'bg-blue-50', link: '/category/dairy', emoji: '🥛' },
        { name: 'Snacks', icon: '🍪', color: 'bg-amber-50', link: '/category/snacks', emoji: '🍪' },
        { name: 'Beverages', icon: '🥤', color: 'bg-purple-50', link: '/category/beverages', emoji: '🥤' },
        { name: 'Care', icon: '🧴', color: 'bg-pink-50', link: '/category/care', emoji: '🧴' },
    ];

    // Mock products for UI demonstration
    const products = [
        { _id: '1', name: 'Fresh Avocado', price: 120, image: 'https://img.freepik.com/free-photo/avocado-cut-half-with-seed-inside-isolated-white_185193-111000.jpg', category: 'Fruits' },
        { _id: '2', name: 'Organic Broccoli', price: 45, image: 'https://img.freepik.com/free-photo/fresh-broccoli-isolated-white-background_185193-111005.jpg', category: 'Fresh Vegetables' },
        { _id: '3', name: 'Almond Milk', price: 299, image: 'https://img.freepik.com/free-photo/glass-bottle-milk-isolated-white-background_185193-111020.jpg', category: 'Dairy' },
        { _id: '4', name: 'Red Apples', price: 180, image: 'https://img.freepik.com/free-photo/red-apple-isolated-white-background_185193-111015.jpg', category: 'Fruits' }
    ];

    return (
        <div className="pt-24 pb-20">
            {/* Hero Section */}
            <section className="container mx-auto px-6 mb-20">
                <div className="glass rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -rotate-12 translate-x-20"></div>

                    <div className="flex-1 space-y-8 z-10 text-center md:text-left">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold rounded-full text-sm"
                        >
                            <Leaf className="w-4 h-4" /> 100% Organic & Fresh
                        </motion.span>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-extrabold text-slate-800 leading-tight"
                        >
                            The Smart Way to <br />
                            <span className="text-primary italic">Shop Groceries</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 text-lg md:max-w-md"
                        >
                            Experience the ultra-premium grocery app with AI recommendations,
                            recipe integration, and real-time nutrition tracking.
                        </motion.p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <motion.button
                                onClick={() => navigate('/shop')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 bg-primary text-white rounded-3xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-green-200"
                            >
                                Shop Now
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                onClick={() => navigate('/walkthrough')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 glass text-slate-700 rounded-3xl font-bold flex items-center justify-center gap-3"
                            >
                                <Play className="w-5 h-5 fill-current" />
                                Watch Walkthrough
                            </motion.button>
                        </div>

                        <div className="flex items-center gap-8 pt-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-slate-500">
                                <span className="text-slate-900 font-bold">20k+</span> Happy Customers
                            </p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="flex-1 relative"
                    >
                        <div className="bg-primary/10 w-full aspect-square rounded-[3rem] p-8">
                            <img
                                src="https://img.freepik.com/free-photo/healthy-vegetables-wooden-table_1150-38014.jpg"
                                className="w-full h-full object-cover rounded-[2rem] shadow-2xl"
                                alt="Banner"
                            />
                        </div>

                        {/* Float Cards */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute -top-10 -left-10 glass p-5 rounded-3xl hidden lg:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">⚡</div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Fastest</p>
                                    <p className="font-bold text-slate-800">10 Min Delivery</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, delay: 0.5 }}
                            className="absolute -bottom-10 -right-10 glass p-5 rounded-3xl hidden lg:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-primary"><Award className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Quality</p>
                                    <p className="font-bold text-slate-800">Grade A Freshness</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section className="container mx-auto px-6 mb-20">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Shop by Category</h2>
                        <p className="text-slate-500 mt-2">Explore our wide range of organic products</p>
                    </div>
                    <button className="text-primary font-bold hover:underline">View All</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            onClick={() => navigate(cat.link)}
                            whileHover={{ y: -10 }}
                            className={`${cat.color} p-8 rounded-[2.5rem] text-center cursor-pointer transition-all hover:shadow-xl`}
                        >
                            <div className="w-16 h-16 bg-accent/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl group-hover:bg-primary group-hover:text-white transition-all">
                                {cat.emoji}
                            </div>
                            <p className="font-bold text-slate-700">{cat.name}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Trending Products */}
            <section className="container mx-auto px-6">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Trending Now</h2>
                        <p className="text-slate-500 mt-2">Best selling products this week</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 glass rounded-full flex items-center justify-center text-slate-400 hover:text-primary">←</button>
                        <button className="w-10 h-10 glass rounded-full flex items-center justify-center text-slate-400 hover:text-primary">→</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(p => (
                        <ProductCard key={p._id} product={p} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
