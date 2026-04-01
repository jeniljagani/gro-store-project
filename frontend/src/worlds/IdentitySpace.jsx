import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Heart, User, Settings, Package, Activity, DollarSign,
    Flame, Zap, Shield, Target, Award, ShoppingBag,
    TrendingUp, Star, Calendar, ChevronRight, Edit3,
    Lock, LogOut, Crown, Utensils, Dumbbell, Scale,
    Brain, Sparkles, RefreshCw, Eye
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { logout, updateProfile, updatePassword, reset } from '../redux/slices/authSlice';
import { toast } from 'react-hot-toast';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    ArcElement, Title, Tooltip, Legend, Filler
);

// ============================================
// MODAL BASE — reusable glassmorphism modal
// ============================================
const ModalBase = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                >
                    <div className="p-8 md:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-white uppercase tracking-wider">{title}</h3>
                            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <span className="text-2xl text-white/40">&times;</span>
                            </button>
                        </div>
                        {children}
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// ============================================
// GLASS CARD — reusable glassmorphism wrapper
// ============================================
const GlassCard = ({ children, className = '', hover = true, onClick, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5, ease: 'easeOut' }}
        whileHover={hover ? { scale: 1.02, y: -4 } : {}}
        onClick={onClick}
        className={`bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] rounded-3xl shadow-2xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
        {children}
    </motion.div>
);

// ============================================
// ANIMATED COUNTER — counts from 0 to value
// ============================================
const AnimatedCounter = ({ value, suffix = '', prefix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasStarted) {
                setHasStarted(true);
            }
        }, { threshold: 0.3 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;
        const numValue = parseFloat(value);
        if (isNaN(numValue)) { setCount(value); return; }

        let start = 0;
        const step = numValue / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= numValue) {
                setCount(numValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [hasStarted, value, duration]);

    return (
        <span ref={ref} className="tabular-nums">
            {prefix}{typeof count === 'number' ? count.toLocaleString() : count}{suffix}
        </span>
    );
};

// ============================================
// SECTION 1: HERO IDENTITY CARD
// ============================================
const HeroIdentity = ({ user }) => {
    const [glowing, setGlowing] = useState(false);

    return (
        <div className="flex flex-col items-center text-center mb-12 pt-8">
            {/* Profile Photo */}
            <motion.div
                className="relative mb-8 group"
                onHoverStart={() => setGlowing(true)}
                onHoverEnd={() => setGlowing(false)}
            >
                {/* Outer glow ring */}
                <div className={`absolute inset-[-6px] rounded-full bg-gradient-to-r from-primary via-emerald-400 to-teal-300 transition-opacity duration-700 ${glowing ? 'opacity-100' : 'opacity-40'} blur-md`} />
                <div className={`absolute inset-[-3px] rounded-full bg-gradient-to-r from-primary via-emerald-400 to-teal-300 transition-opacity duration-500 ${glowing ? 'opacity-100' : 'opacity-60'}`} />

                {/* Photo container */}
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center overflow-hidden border-4 border-slate-900">
                    <User className="w-14 h-14 text-white/60" />
                    {/* Upload overlay */}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Premium badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Crown className="w-3 h-3 text-white" />
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">Premium</span>
                </div>
            </motion.div>

            {/* Name & Info */}
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight"
            >
                {user?.name || 'FreshGo Member'}
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/40 font-medium text-sm mb-1"
            >
                {user?.email || 'member@freshgo.com'}
            </motion.p>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 mt-3"
            >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary text-xs font-bold uppercase tracking-widest">Active Now</span>
            </motion.div>
        </div>
    );
};

// ============================================
// SECTION 2: PERSONAL STATS (Spotify Wrapped)
// ============================================
const PersonalStats = () => {
    const stats = [
        { icon: ShoppingBag, label: 'Total Orders', value: 48, color: 'from-blue-500 to-cyan-400', iconBg: 'bg-blue-500/20', textColor: 'text-blue-400' },
        { icon: Heart, label: 'Healthy Score', value: 82, suffix: '%', color: 'from-green-500 to-emerald-400', iconBg: 'bg-green-500/20', textColor: 'text-green-400' },
        { icon: Flame, label: 'Fav Category', value: 'Snacks', isText: true, color: 'from-orange-500 to-amber-400', iconBg: 'bg-orange-500/20', textColor: 'text-orange-400' },
        { icon: DollarSign, label: 'Money Saved', value: 2450, prefix: '₹', color: 'from-purple-500 to-violet-400', iconBg: 'bg-purple-500/20', textColor: 'text-purple-400' },
        { icon: Zap, label: 'Calories', value: 32000, suffix: ' kcal', color: 'from-rose-500 to-pink-400', iconBg: 'bg-rose-500/20', textColor: 'text-rose-400' },
        { icon: Star, label: 'Loyalty Points', value: 1280, color: 'from-amber-500 to-yellow-400', iconBg: 'bg-amber-500/20', textColor: 'text-amber-400' },
    ];

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                Your Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((s, i) => (
                    <GlassCard key={i} className="p-5 text-center" delay={i * 0.05}>
                        <div className={`w-12 h-12 mx-auto rounded-2xl ${s.iconBg} flex items-center justify-center mb-4`}>
                            <s.icon className={`w-6 h-6 ${s.textColor}`} />
                        </div>
                        <p className="text-2xl md:text-3xl font-black text-white mb-1">
                            {s.isText ? s.value : (
                                <AnimatedCounter value={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} />
                            )}
                        </p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{s.label}</p>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

// ============================================
// SECTION 3: AI PERSONALITY ANALYSIS
// ============================================
const AIPersonalityAnalysis = ({ user }) => {
    const insights = [
        { emoji: '🥩', text: `${user?.name || 'You'} prefer${user?.name ? 's' : ''} high-protein foods and evening snacks.` },
        { emoji: '📅', text: 'You shop most on weekends, especially Saturday evenings.' },
        { emoji: '🥛', text: 'You have a strong preference for dairy products.' },
        { emoji: '🌿', text: 'Your organic buying rate is 73% — above average!' },
    ];

    return (
        <div className="mb-12">
            <GlassCard className="p-8 md:p-10 relative overflow-hidden" hover={false}>
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -z-0" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-wider">AI Personality Analysis</h3>
                            <p className="text-xs text-white/30 font-medium">Based on your shopping behavior</p>
                        </div>
                    </div>

                    {/* Food Personality Type */}
                    <div className="bg-gradient-to-r from-primary/20 to-emerald-500/10 border border-primary/20 rounded-2xl p-6 mb-6">
                        <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Your Food Personality</p>
                        <p className="text-3xl font-black text-white">🏋️ The Protein Builder</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.map((insight, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-3 bg-white/[0.03] rounded-2xl p-4 border border-white/[0.05]"
                            >
                                <span className="text-2xl">{insight.emoji}</span>
                                <p className="text-sm text-white/70 font-medium leading-relaxed">{insight.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

// ============================================
// SECTION 4: FAVORITE ITEMS SHOWCASE
// ============================================
const FavoriteShowcase = () => {
    const navigate = useNavigate();
    const favorites = [
        { name: 'Organic Milk', emoji: '🥛', price: '₹65', category: 'Dairy' },
        { name: 'Paneer', emoji: '🧀', price: '₹120', category: 'Dairy' },
        { name: 'Premium Chips', emoji: '🍿', price: '₹45', category: 'Snacks' },
        { name: 'Greek Yogurt', emoji: '🥣', price: '₹90', category: 'Dairy' },
        { name: 'Almonds', emoji: '🥜', price: '₹250', category: 'Nuts' },
        { name: 'Avocados', emoji: '🥑', price: '₹180', category: 'Fruits' },
    ];

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <Heart className="w-6 h-6 text-rose-400" />
                    Most Purchased
                </h2>
                <button
                    onClick={() => navigate('/favorites')}
                    className="text-xs text-primary font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                >
                    View All <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {favorites.map((item, i) => (
                    <GlassCard key={i} className="p-6 min-w-[180px] flex-shrink-0 group" delay={i * 0.05}>
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform select-none">{item.emoji}</div>
                        <p className="text-sm font-black text-white mb-1">{item.name}</p>
                        <p className="text-xs text-white/30 font-medium mb-2">{item.category}</p>
                        <p className="text-lg font-black text-primary">{item.price}</p>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

// ============================================
// SECTION 5: HEALTH & NUTRITION PROFILE
// ============================================
const HealthProfile = () => {
    const [goal, setGoal] = useState('maintain');
    const goals = [
        { id: 'loss', label: 'Weight Loss', icon: Scale, color: 'text-blue-400' },
        { id: 'gain', label: 'Weight Gain', icon: Dumbbell, color: 'text-orange-400' },
        { id: 'maintain', label: 'Maintain', icon: Target, color: 'text-green-400' },
    ];

    const nutritionBars = [
        { label: 'Protein', goal: 70, color: 'bg-blue-500' },
        { label: 'Calories', goal: 82, color: 'bg-orange-500' },
        { label: 'Fiber', goal: 56, color: 'bg-green-500' },
        { label: 'Vitamins', goal: 91, color: 'bg-purple-500' },
    ];

    const doughnutData = {
        labels: ['Protein', 'Carbs', 'Fat', 'Fiber'],
        datasets: [{
            data: [35, 40, 15, 10],
            backgroundColor: ['#3b82f6', '#f97316', '#ef4444', '#22c55e'],
            borderWidth: 0,
            hoverOffset: 8,
        }],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                <Activity className="w-6 h-6 text-emerald-400" />
                Health & Nutrition
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Goal Selector + Progress */}
                <div className="lg:col-span-7">
                    <GlassCard className="p-8" hover={false}>
                        {/* Goal Tabs */}
                        <div className="flex gap-2 p-1.5 bg-white/[0.03] rounded-2xl border border-white/[0.05] mb-8">
                            {goals.map(g => (
                                <button
                                    key={g.id}
                                    onClick={() => setGoal(g.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${goal === g.id ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/70'
                                        }`}
                                >
                                    <g.icon className="w-4 h-4" />
                                    {g.label}
                                </button>
                            ))}
                        </div>

                        {/* Nutrition Bars */}
                        <div className="space-y-6">
                            {nutritionBars.map((bar, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-white/70">{bar.label} Goal</span>
                                        <span className="text-sm font-black text-white">{bar.goal}%</span>
                                    </div>
                                    <div className="h-3 bg-white/[0.05] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${bar.goal}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
                                            className={`h-full ${bar.color} rounded-full`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Macro Chart */}
                <div className="lg:col-span-5">
                    <GlassCard className="p-8 h-full flex flex-col items-center justify-center" hover={false}>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Macro Breakdown</p>
                        <div className="w-48 h-48 relative">
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-3xl font-black text-white">2.1k</p>
                                <p className="text-[10px] font-bold text-white/30 uppercase">avg cal/day</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            {[
                                { label: 'Protein', color: 'bg-blue-500', pct: '35%' },
                                { label: 'Carbs', color: 'bg-orange-500', pct: '40%' },
                                { label: 'Fat', color: 'bg-red-500', pct: '15%' },
                                { label: 'Fiber', color: 'bg-green-500', pct: '10%' },
                            ].map((m, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${m.color}`} />
                                    <span className="text-[10px] font-bold text-white/50">{m.label} {m.pct}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

// ============================================
// SECTION 6: ORDER HISTORY TIMELINE
// ============================================
const OrderTimeline = () => {
    const navigate = useNavigate();
    const orders = [
        { date: 'Today', items: ['Organic Milk', 'Whole Wheat Bread', 'Eggs'], total: '₹320', status: 'Delivered' },
        { date: 'Yesterday', items: ['Fresh Fruits Pack', 'Greek Yogurt'], total: '₹480', status: 'Delivered' },
        { date: '3 days ago', items: ['Paneer', 'Spinach', 'Tomatoes', 'Butter'], total: '₹560', status: 'Delivered' },
        { date: '1 week ago', items: ['Protein Bars x6', 'Almond Milk'], total: '₹890', status: 'Delivered' },
    ];

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-cyan-400" />
                Order Timeline
            </h2>

            <GlassCard className="p-8" hover={false}>
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-white/[0.06]" />

                    <div className="space-y-8">
                        {orders.map((order, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-6 group"
                            >
                                {/* Timeline dot */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                                        <Package className="w-4 h-4 text-primary" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-grow bg-white/[0.03] rounded-2xl p-5 border border-white/[0.05] group-hover:border-white/[0.1] transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-sm font-black text-white">{order.date}</p>
                                            <p className="text-xs text-white/30 font-medium">{order.status}</p>
                                        </div>
                                        <span className="text-lg font-black text-primary">{order.total}</span>
                                    </div>
                                    <p className="text-xs text-white/50 font-medium mb-3">{order.items.join(' · ')}</p>
                                    <button
                                        onClick={() => navigate('/shop')}
                                        className="flex items-center gap-1.5 text-[10px] text-primary font-bold uppercase tracking-widest hover:gap-2.5 transition-all"
                                    >
                                        <RefreshCw className="w-3 h-3" /> Reorder
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

// ============================================
// SECTION 7: ACHIEVEMENT / BADGE SYSTEM
// ============================================
const Achievements = () => {
    const badges = [
        { icon: '🛒', label: 'First Order', desc: 'Completed your first purchase', unlocked: true, color: 'from-green-500/20 to-emerald-500/10' },
        { icon: '🥦', label: 'Healthy Buyer', desc: 'Bought 20+ organic items', unlocked: true, color: 'from-emerald-500/20 to-teal-500/10' },
        { icon: '🍿', label: 'Snack Lover', desc: 'Top snack category buyer', unlocked: true, color: 'from-orange-500/20 to-amber-500/10' },
        { icon: '👑', label: 'Premium Member', desc: 'Joined premium tier', unlocked: true, color: 'from-amber-500/20 to-yellow-500/10' },
        { icon: '🔥', label: '7-Day Streak', desc: 'Ordered 7 days in a row', unlocked: false, color: 'from-rose-500/20 to-red-500/10' },
        { icon: '🌍', label: 'Eco Warrior', desc: 'Chose eco-friendly 50 times', unlocked: false, color: 'from-cyan-500/20 to-blue-500/10' },
        { icon: '⭐', label: 'Reviewer', desc: 'Left 10 product reviews', unlocked: false, color: 'from-purple-500/20 to-violet-500/10' },
        { icon: '💎', label: 'Diamond Buyer', desc: 'Spent ₹50,000+ total', unlocked: false, color: 'from-sky-500/20 to-indigo-500/10' },
    ];

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-400" />
                Achievements
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge, i) => (
                    <GlassCard
                        key={i}
                        className={`p-6 text-center relative overflow-hidden ${!badge.unlocked ? 'opacity-40' : ''}`}
                        delay={i * 0.04}
                    >
                        {/* Badge glow */}
                        {badge.unlocked && (
                            <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} -z-0`} />
                        )}
                        <div className="relative z-10">
                            <div className="text-4xl mb-3 select-none">{badge.icon}</div>
                            <p className="text-sm font-black text-white mb-1">{badge.label}</p>
                            <p className="text-[10px] text-white/30 font-medium">{badge.desc}</p>
                            {!badge.unlocked && (
                                <div className="mt-2 flex items-center justify-center gap-1">
                                    <Lock className="w-3 h-3 text-white/20" />
                                    <span className="text-[9px] text-white/20 font-bold uppercase">Locked</span>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

// ============================================
// SECTION 8: SETTINGS
// ============================================
const SettingsSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth);

    const [activeModal, setActiveModal] = useState(null); // 'profile', 'password', 'privacy'

    // Form States
    const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [privacyData, setPrivacyData] = useState({
        publicProfile: user?.privacySettings?.publicProfile ?? true,
        shareStats: user?.privacySettings?.shareStats ?? true,
        anonymousAnalytics: user?.privacySettings?.anonymousAnalytics ?? false
    });

    useEffect(() => {
        if (isSuccess && activeModal) {
            toast.success(
                activeModal === 'password' ? 'Password updated!' :
                    activeModal === 'privacy' ? 'Privacy settings saved!' :
                        'Profile updated!'
            );
            setActiveModal(null);
            dispatch(reset());
        }
        if (isError && message) {
            toast.error(message);
            dispatch(reset());
        }
    }, [isSuccess, isError, message, activeModal, dispatch]);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        dispatch(updateProfile(profileData));
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        dispatch(updatePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        }));
    };

    const handlePrivacyUpdate = () => {
        dispatch(updateProfile({ privacySettings: privacyData }));
    };

    const settingsItems = [
        { icon: Edit3, label: 'Edit Profile', desc: 'Update your name and photo', action: () => setActiveModal('profile') },
        { icon: Lock, label: 'Change Password', desc: 'Update your security credentials', action: () => setActiveModal('password') },
        { icon: Eye, label: 'Privacy Settings', desc: 'Manage data and visibility', action: () => setActiveModal('privacy') },
        {
            icon: LogOut, label: 'Sign Out', desc: 'Log out of your account', danger: true,
            action: () => { dispatch(logout()); navigate('/'); }
        },
    ];

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                <Settings className="w-6 h-6 text-slate-400" />
                Settings
            </h2>

            <GlassCard className="divide-y divide-white/[0.05]" hover={false}>
                {settingsItems.map((item, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ x: 6 }}
                        onClick={item.action}
                        className="w-full flex items-center justify-between p-6 group text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.danger ? 'bg-red-500/10' : 'bg-white/[0.05]'
                                }`}>
                                <item.icon className={`w-5 h-5 ${item.danger ? 'text-red-400' : 'text-white/60 group-hover:text-primary'} transition-colors`} />
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${item.danger ? 'text-red-400' : 'text-white'}`}>{item.label}</p>
                                <p className="text-xs text-white/30 font-medium">{item.desc}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                    </motion.button>
                ))}
            </GlassCard>

            {/* Edit Profile Modal */}
            <ModalBase isOpen={activeModal === 'profile'} onClose={() => setActiveModal(null)} title="Edit Profile">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="Your name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </ModalBase>

            {/* Change Password Modal */}
            <ModalBase isOpen={activeModal === 'password'} onClose={() => setActiveModal(null)} title="Change Password">
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Current Password</label>
                        <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">New Password</label>
                        <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </ModalBase>

            {/* Privacy Settings Modal */}
            <ModalBase isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Privacy Settings">
                <div className="space-y-6">
                    {[
                        { id: 'publicProfile', label: 'Public Profile', desc: 'Allow others to see your healthy score' },
                        { id: 'shareStats', label: 'Share Stats', desc: 'Include your stats in community leaderboards' },
                        { id: 'anonymousAnalytics', label: 'Anonymous Analytics', desc: 'Help us improve with usage data' },
                    ].map((pref) => (
                        <div key={pref.id} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                            <div>
                                <p className="text-sm font-bold text-white">{pref.label}</p>
                                <p className="text-[10px] text-white/30 font-medium">{pref.desc}</p>
                            </div>
                            <button
                                onClick={() => setPrivacyData({ ...privacyData, [pref.id]: !privacyData[pref.id] })}
                                className={`w-12 h-6 rounded-full relative transition-colors ${privacyData[pref.id] ? 'bg-primary' : 'bg-white/10'}`}
                            >
                                <motion.div
                                    animate={{ x: privacyData[pref.id] ? 26 : 4 }}
                                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                                />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={handlePrivacyUpdate}
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
                    >
                        {isLoading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </ModalBase>
        </div>
    );
};

// ============================================
// SECTION 9: AI RECOMMENDATIONS
// ============================================
const AIRecommendations = ({ user }) => {
    const navigate = useNavigate();
    const recommendations = [
        { name: 'Whey Protein', emoji: '💪', reason: 'Matches your protein-heavy diet' },
        { name: 'Oat Milk', emoji: '🥛', reason: 'Try a dairy alternative' },
        { name: 'Quinoa Pack', emoji: '🌾', reason: 'High in fiber, fits your goals' },
        { name: 'Dark Chocolate', emoji: '🍫', reason: 'Healthy weekend treat' },
    ];

    return (
        <div className="mb-20">
            <GlassCard className="p-8 md:p-10 relative overflow-hidden" hover={false}>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl -z-0" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <h3 className="text-xl font-black text-white uppercase tracking-wider">AI Picks for You</h3>
                    </div>
                    <p className="text-sm text-white/40 font-medium mb-8">
                        {user?.name || 'Hey'}, based on your activity, you might love these:
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recommendations.map((rec, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => navigate('/shop')}
                                className="bg-white/[0.04] rounded-2xl p-5 border border-white/[0.06] cursor-pointer hover:border-primary/30 transition-colors text-center"
                            >
                                <div className="text-4xl mb-3 select-none">{rec.emoji}</div>
                                <p className="text-sm font-bold text-white mb-1">{rec.name}</p>
                                <p className="text-[10px] text-white/30 font-medium">{rec.reason}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================
const IdentitySpace = () => {
    const { user } = useSelector(state => state.auth);

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden font-outfit">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-0">
                {/* Main gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

                {/* Color orbs based on "personality" */}
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-green-500/[0.04] rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[50%] right-[5%] w-[400px] h-[400px] bg-primary/[0.06] rounded-full blur-[100px]" style={{ animationDelay: '2s', animationDuration: '8s' }} />
                <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] bg-amber-500/[0.04] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />

                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 pt-28 pb-12 max-w-6xl">
                <HeroIdentity user={user} />
                <PersonalStats />
                <AIPersonalityAnalysis user={user} />
                <FavoriteShowcase />
                <HealthProfile />
                <OrderTimeline />
                <Achievements />
                <SettingsSection />
                <AIRecommendations user={user} />
            </div>
        </div>
    );
};

export default IdentitySpace;
