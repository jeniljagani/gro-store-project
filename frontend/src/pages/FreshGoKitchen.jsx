import { useState, useEffect, useRef, useMemo, useCallback, forwardRef, memo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flame, ChefHat, ShoppingCart, Users, X, BookOpen, Minus, Plus, Sparkles, Award, Heart, Check } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import HTMLFlipBook from 'react-pageflip';

/* ─── Constants ─────────────────────────────────────────────── */
const diffColor = {
    Easy: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-400' },
    Medium: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-400' },
    Hard: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', dot: 'bg-rose-400' },
};

const categoryEmoji = {
    'All': '🍽️', 'Breakfast': '🥞', 'Main Course': '🍛', 'Snacks': '🥗', 'Desserts': '🍮', 'Beverages': '🥤',
};

const categories = ['All', 'Breakfast', 'Main Course', 'Snacks', 'Desserts', 'Beverages'];

/* ═══════════════════════════════════════════════════════════════
   RECIPE CARD — Premium Kitchen Counter Card
   ═══════════════════════════════════════════════════════════════ */
const RecipeCard = memo(({ recipe, onClick, index }) => {
    const dc = diffColor[recipe.difficulty] || diffColor.Medium;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.07, type: 'spring', stiffness: 100, damping: 14 }}
            whileHover={{ y: -14, scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onClick(recipe)}
            className="cursor-pointer group will-change-transform"
        >
            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_40px_-8px_rgba(0,0,0,0.08)] border border-stone-100/80 group-hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.18)] transition-shadow duration-500">
                {/* Image Section */}
                <div className="relative h-56 sm:h-60 overflow-hidden">
                    <img
                        src={recipe.image}
                        alt={recipe.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-[800ms] ease-out will-change-transform"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${dc.bg} ${dc.border} border backdrop-blur-sm`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${dc.dot}`} />
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${dc.text}`}>{recipe.difficulty}</span>
                        </div>
                        {recipe.calories && (
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full">
                                <Flame className="w-3 h-3 text-orange-300" />
                                <span className="text-[10px] font-bold text-white">{recipe.calories} cal</span>
                            </div>
                        )}
                    </div>

                    {/* Bottom time badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        <span className="text-xs font-bold text-stone-700">{recipe.cookingTime} min</span>
                    </div>

                    {/* Servings badge */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg">
                        <Users className="w-3.5 h-3.5 text-stone-500" />
                        <span className="text-xs font-bold text-stone-700">{recipe.servings}</span>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-6">
                    <h3 className="font-black text-stone-900 text-lg mb-2.5 line-clamp-1 group-hover:text-emerald-600 transition-colors duration-300">
                        {recipe.name}
                    </h3>

                    <div className="flex items-center justify-between">
                        {recipe.category && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 text-stone-500 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-stone-100">
                                {categoryEmoji[recipe.category]} {recipe.category}
                            </span>
                        )}
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-stone-300 font-bold uppercase tracking-wider">Open →</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

/* ═══════════════════════════════════════════════════════════════
   BOOK PAGE — Realistic paper for react-pageflip
   ═══════════════════════════════════════════════════════════════ */
const BookPage = forwardRef(({ children, className = '' }, ref) => (
    <div ref={ref} className={`bg-[#FBF7F0] relative overflow-hidden select-none ${className}`}
        style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
    >
        {/* Subtle paper grain */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Ccircle cx='10' cy='10' r='0.5'/%3E%3Ccircle cx='30' cy='30' r='0.4'/%3E%3Ccircle cx='50' cy='50' r='0.6'/%3E%3Ccircle cx='20' cy='40' r='0.3'/%3E%3Ccircle cx='40' cy='15' r='0.5'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        {/* Page edge shadow (inner left) */}
        <div className="absolute top-0 left-0 bottom-0 w-6 bg-gradient-to-r from-stone-200/30 to-transparent pointer-events-none z-10" />
        {children}
    </div>
));

/* ═══════════════════════════════════════════════════════════════
   SERVINGS SELECTOR — "Cooking for X people"
   ═══════════════════════════════════════════════════════════════ */
const ServingsSelector = memo(({ baseServings, servings, onServingsChange }) => (
    <div className="flex items-center justify-between py-3 mb-4">
        <div>
            <p className="text-stone-800 text-sm font-bold">Cooking for</p>
            <p className="text-stone-400 text-[10px]">Base recipe serves {baseServings}</p>
        </div>
        <div className="flex items-center gap-3 bg-stone-100 rounded-2xl px-2 py-1">
            <button
                onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); onServingsChange(Math.max(1, servings - 1)); }}
                className="w-8 h-8 rounded-xl bg-white text-stone-600 flex items-center justify-center shadow-sm hover:bg-stone-50 transition-colors active:scale-90 relative z-50 cursor-pointer"
            >
                <Minus className="w-3.5 h-3.5 pointer-events-none" />
            </button>
            <div className="text-center min-w-[3rem]">
                <motion.span
                    key={servings}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-xl font-black text-stone-900 block"
                >
                    {servings}
                </motion.span>
                <p className="text-[8px] text-stone-400 font-bold uppercase tracking-wider -mt-1">people</p>
            </div>
            <button
                onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); onServingsChange(Math.min(20, servings + 1)); }}
                className="w-8 h-8 rounded-xl bg-white text-stone-600 flex items-center justify-center shadow-sm hover:bg-stone-50 transition-colors active:scale-90 relative z-50 cursor-pointer"
            >
                <Plus className="w-3.5 h-3.5 pointer-events-none" />
            </button>
        </div>
    </div>
));

/* ═══════════════════════════════════════════════════════════════
   LIVING COOKBOOK — Page flip with servings
   ═══════════════════════════════════════════════════════════════ */
const LivingCookbook = memo(({ recipe, onClose, onAddToCart }) => {
    const bookRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [servings, setServings] = useState(recipe?.servings || 2);
    const [addedToCart, setAddedToCart] = useState(false);

    if (!recipe) return null;

    const baseServings = recipe.servings || 1;
    const multiplier = servings / baseServings;
    const ingredients = recipe.ingredients || [];
    const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];

    const scaledIngredients = ingredients.map(ing => ({
        ...ing,
        scaledQty: Math.round(ing.quantityPerServing * multiplier * 10) / 10,
    }));

    const instructionPairs = [];
    for (let i = 0; i < instructions.length; i += 2) {
        instructionPairs.push(instructions.slice(i, i + 2).map((inst, idx) => ({ text: inst, num: i + idx + 1 })));
    }

    const handleAddToCart = (e) => {
        e.stopPropagation();
        onAddToCart(recipe, servings);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex items-center justify-center"
        >
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at center, rgba(30,28,25,0.75) 0%, rgba(15,14,12,0.92) 100%)' }}
            />

            {/* Floating ambience */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-emerald-400/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Close btn */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                onClick={onClose}
                className="absolute top-5 right-5 z-50 w-11 h-11 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors group"
            >
                <X className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
            </motion.button>

            {/* Recipe title above book */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-20"
            >
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">FreshGo Kitchen presents</p>
                <h2 className="text-white/90 text-xl font-black mt-1">{recipe.name}</h2>
            </motion.div>

            {/* Book Container */}
            <motion.div
                initial={{ scale: 0.6, opacity: 0, rotateX: 10 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.6, opacity: 0, rotateX: -10 }}
                transition={{ type: 'spring', stiffness: 70, damping: 16 }}
                className="relative z-10 mt-8"
                style={{ perspective: 2000 }}
            >
                {/* Book shadow underneath */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/40 blur-2xl rounded-full" />

                <HTMLFlipBook
                    ref={bookRef}
                    width={380}
                    height={520}
                    size="stretch"
                    minWidth={280}
                    maxWidth={420}
                    minHeight={400}
                    maxHeight={560}
                    showCover={true}
                    mobileScrollSupport={true}
                    maxShadowOpacity={0.5}
                    drawShadow={true}
                    flippingTime={700}
                    onFlip={(e) => setCurrentPage(e.data)}
                    className="shadow-2xl"
                    style={{ boxShadow: '0 50px 100px -25px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)' }}
                >
                    {/* ─── COVER PAGE ─── */}
                    <BookPage>
                        <div className="h-full flex flex-col items-center justify-center p-8 relative text-white overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #1a3a2a 0%, #0d1f17 40%, #162920 100%)' }}
                        >
                            {/* Decorative frame */}
                            <div className="absolute inset-4 border border-amber-200/15 rounded-xl pointer-events-none" />
                            <div className="absolute inset-6 border border-amber-200/8 rounded-lg pointer-events-none" />

                            {/* Gold flourish */}
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent mb-6" />

                            <Award className="w-8 h-8 text-amber-300/40 mb-4" />

                            <h2 className="text-2xl font-black text-center leading-tight mb-2 tracking-tight"
                                style={{ fontFamily: "'Georgia', serif" }}
                            >
                                {recipe.name}
                            </h2>

                            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent my-4" />

                            <p className="text-amber-200/40 text-[11px] font-semibold tracking-[0.2em] uppercase">FreshGo Kitchen</p>

                            <div className="flex gap-8 mt-8 text-amber-200/30 text-[10px] font-bold tracking-wider">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.cookingTime}m</span>
                                <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {recipe.calories}cal</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {recipe.servings}</span>
                            </div>

                            <motion.p
                                animate={{ opacity: [0.2, 0.6, 0.2] }}
                                transition={{ repeat: Infinity, duration: 2.5 }}
                                className="absolute bottom-6 text-amber-200/30 text-[9px] font-bold tracking-[0.4em] uppercase"
                            >
                                Tap to open →
                            </motion.p>
                        </div>
                    </BookPage>

                    {/* ─── RECIPE IMAGE PAGE ─── */}
                    <BookPage>
                        <div className="h-full flex flex-col">
                            <div className="flex-[3] overflow-hidden relative">
                                <img src={recipe.image} alt={recipe.name} loading="lazy" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#FBF7F0] via-transparent to-transparent" />
                            </div>
                            <div className="flex-[1] p-5 flex flex-col justify-center">
                                <h3 className="text-xl font-black text-stone-800 mb-2" style={{ fontFamily: "'Georgia', serif" }}>{recipe.name}</h3>
                                <div className="flex gap-5 text-stone-400 text-xs font-semibold">
                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-500" /> {recipe.cookingTime} min</span>
                                    <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-400" /> {recipe.calories} cal</span>
                                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-blue-400" /> {recipe.servings} srv</span>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${diffColor[recipe.difficulty]?.bg} ${diffColor[recipe.difficulty]?.text}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${diffColor[recipe.difficulty]?.dot}`} />
                                        {recipe.difficulty}
                                    </span>
                                    <span className="text-[10px] text-stone-300 font-semibold uppercase tracking-wider">{recipe.category}</span>
                                </div>
                            </div>
                        </div>
                    </BookPage>

                    {/* ─── INGREDIENTS PAGE — with servings selector ─── */}
                    <BookPage>
                        <div className="h-full p-6 flex flex-col" style={{ fontFamily: "'Georgia', serif" }}>
                            {/* Header ornament */}
                            <div className="text-center mb-2">
                                <div className="w-10 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mx-auto mb-3" />
                                <h3 className="text-base font-black text-stone-800 uppercase tracking-[0.15em]">Ingredients</h3>
                                <div className="w-10 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mx-auto mt-3" />
                            </div>

                            {/* Servings selector */}
                            <ServingsSelector
                                baseServings={baseServings}
                                servings={servings}
                                onServingsChange={setServings}
                            />

                            {/* Ingredient list */}
                            <div className="flex-1 overflow-y-auto space-y-0 pr-1 -mx-1 px-1">
                                {scaledIngredients.map((ing, i) => (
                                    <div key={i}
                                        className="flex items-center justify-between py-2.5 border-b border-stone-100/80 last:border-0"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-1 h-1 rounded-full bg-emerald-400" />
                                            <span className="text-stone-700 text-[13px] font-medium">{ing.name || 'Ingredient'}</span>
                                        </div>
                                        <span className="text-stone-400 text-[12px] font-bold tabular-nums tracking-tight">
                                            {ing.scaledQty} {ing.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Add to cart */}
                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={handleAddToCart}
                                className={`mt-3 w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${addedToCart
                                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-100 hover:shadow-emerald-200'
                                    }`}
                            >
                                {addedToCart ? (
                                    <><Check className="w-4 h-4" /> Added to Cart!</>
                                ) : (
                                    <><ShoppingCart className="w-4 h-4" /> Add {scaledIngredients.length} Items to Cart</>
                                )}
                            </motion.button>

                            <p className="text-center text-stone-300 text-[9px] mt-2">
                                Quantities automatically scaled for {servings} {servings === 1 ? 'person' : 'people'}
                            </p>
                        </div>
                    </BookPage>

                    {/* ─── INSTRUCTION PAGES ─── */}
                    {instructionPairs.map((pair, pageIdx) => (
                        <BookPage key={`inst-${pageIdx}`}>
                            <div className="h-full p-6 flex flex-col" style={{ fontFamily: "'Georgia', serif" }}>
                                {pageIdx === 0 && (
                                    <div className="text-center mb-5">
                                        <div className="w-10 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mx-auto mb-3" />
                                        <h3 className="text-base font-black text-stone-800 uppercase tracking-[0.15em]">Method</h3>
                                        <div className="w-10 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mx-auto mt-3" />
                                    </div>
                                )}
                                <div className="flex-1 space-y-6">
                                    {pair.map(({ text, num }) => (
                                        <div key={num} className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-emerald-600 text-xs font-black">{num}</span>
                                            </div>
                                            <p className="text-stone-600 text-[13px] leading-[1.7] font-normal flex-1 italic">{text}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-stone-200 text-[9px] text-right mt-auto pt-4 font-semibold tracking-wider">— {pageIdx + 3} —</p>
                            </div>
                        </BookPage>
                    ))}

                    {/* ─── BACK COVER ─── */}
                    <BookPage>
                        <div className="h-full flex flex-col items-center justify-center p-8 relative text-white overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #2a1a0e 0%, #1a0f07 40%, #241810 100%)' }}
                        >
                            <div className="absolute inset-4 border border-amber-200/10 rounded-xl pointer-events-none" />

                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent mb-6" />

                            <ChefHat className="w-10 h-10 text-amber-300/30 mb-4" />

                            <h3 className="text-lg font-black mb-2" style={{ fontFamily: "'Georgia', serif" }}>Bon Appétit!</h3>

                            <p className="text-amber-200/30 text-xs text-center max-w-[16rem] leading-relaxed mb-6">
                                Every ingredient you need is available in our marketplace. One tap and it's in your cart.
                            </p>

                            <div className="w-10 h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent mb-6" />

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddToCart}
                                className="px-7 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-900/30"
                            >
                                <ShoppingCart className="w-4 h-4" /> Order All Ingredients
                            </motion.button>

                            <p className="absolute bottom-5 text-amber-200/15 text-[8px] font-bold tracking-[0.4em] uppercase">FreshGo Kitchen ©</p>
                        </div>
                    </BookPage>
                </HTMLFlipBook>

                {/* Navigation hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center text-white/25 text-[10px] font-medium mt-5 tracking-wider"
                >
                    DRAG PAGE EDGES TO FLIP
                </motion.p>
            </motion.div>
        </motion.div>
    );
});

/* ═══════════════════════════════════════════════════════════════
   MAIN — FRESHGO KITCHEN
   ═══════════════════════════════════════════════════════════════ */
const FreshGoKitchen = () => {
    const dispatch = useDispatch();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/recipes');
                setRecipes(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        setMousePos({ x, y });
    }, []);

    const filteredRecipes = useMemo(() => {
        return selectedCategory === 'All' ? recipes : recipes.filter(r => r.category === selectedCategory);
    }, [recipes, selectedCategory]);

    const handleAddToCart = useCallback((recipe, servingsCount) => {
        if (!recipe.ingredients || recipe.ingredients.length === 0) {
            toast.error('No ingredients found for this recipe.');
            return;
        }
        const baseServings = recipe.servings || 1;
        const multiplier = (servingsCount || baseServings) / baseServings;

        recipe.ingredients.forEach(ing => {
            const name = ing.name || ing.product?.name || 'Ingredient';
            const scaledQty = Math.round(ing.quantityPerServing * multiplier * 10) / 10;
            dispatch(addToCart({
                _id: ing.product?._id || `recipe-${recipe._id}-${name.replace(/\s+/g, '-').toLowerCase()}`,
                name: `${name} (${scaledQty} ${ing.unit})`,
                price: ing.product?.price || 30,
                image: recipe.image,
                qty: 1,
            }));
        });
        toast.success(
            `${recipe.ingredients.length} ingredients added for ${servingsCount || baseServings} people!`,
            { icon: '🛒', style: { fontWeight: 600 } }
        );
    }, [dispatch]);


    return (
        <div className="min-h-screen bg-[#F7F3EC] pt-24 pb-24 overflow-hidden">
            {/* ─── KITCHEN COUNTER BACKGROUND ─── */}
            <div ref={containerRef} onMouseMove={handleMouseMove} className="relative">
                {/* Warm wooden texture with parallax */}
                <div
                    className="fixed inset-0 -z-10 will-change-transform"
                    style={{
                        background: `
                            radial-gradient(ellipse at 50% 0%, rgba(255,240,220,0.35) 0%, transparent 60%),
                            linear-gradient(180deg, #F7F3EC 0%, #EDE7DC 100%),
                            repeating-linear-gradient(87deg, transparent 0px, transparent 80px, rgba(160,140,110,0.04) 80px, rgba(160,140,110,0.04) 81px),
                            repeating-linear-gradient(3deg, transparent 0px, transparent 40px, rgba(160,140,110,0.025) 40px, rgba(160,140,110,0.025) 41px)
                        `,
                        transform: `translate3d(${mousePos.x * 0.25}px, ${mousePos.y * 0.25}px, 0)`,
                    }}
                />

                {/* Light spots */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[40vh] bg-amber-50/30 blur-[120px] rounded-full -z-10 pointer-events-none" />
                <div className="fixed bottom-0 right-0 w-[50vw] h-[30vh] bg-emerald-50/20 blur-[100px] rounded-full -z-10 pointer-events-none" />

                <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
                    {/* ─── PREMIUM HEADER ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: -25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                        className="text-center mb-14"
                    >
                        {/* Brand tag */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-amber-50 px-5 py-2.5 rounded-2xl mb-7 border border-emerald-100/50 shadow-sm"
                        >
                            <ChefHat className="w-4 h-4 text-emerald-600" />
                            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.25em]">FreshGo Kitchen</span>
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        </motion.div>

                        <h1 className="text-5xl sm:text-7xl font-black text-stone-900 mb-5 leading-[1.1] tracking-tight">
                            What's cooking
                            <br />
                            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                tonight?
                            </span>
                        </h1>

                        <p className="text-stone-400 font-medium text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
                            Tap a recipe to open the cookbook. Pick servings. Add ingredients to cart — all in one flow.
                        </p>
                    </motion.div>

                    {/* ─── CATEGORY PILLS ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-12 justify-center flex-wrap"
                    >
                        {categories.map((cat, i) => (
                            <motion.button
                                key={cat}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.04 }}
                                whileTap={{ scale: 0.93 }}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${selectedCategory === cat
                                    ? 'bg-stone-900 text-white shadow-xl shadow-stone-300/40'
                                    : 'bg-white text-stone-500 hover:bg-stone-50 border border-stone-200/80 hover:border-stone-300 shadow-sm'
                                    }`}
                            >
                                <span className="text-base">{categoryEmoji[cat]}</span>
                                {cat}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* ─── LOADING SKELETON ─── */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="animate-pulse bg-white rounded-3xl overflow-hidden shadow-lg">
                                    <div className="h-56 bg-gradient-to-br from-stone-200 to-stone-100" />
                                    <div className="p-6 space-y-3">
                                        <div className="h-5 bg-stone-200 rounded-lg w-3/4" />
                                        <div className="h-3 bg-stone-100 rounded-lg w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ─── RECIPE CARDS GRID ─── */}
                    {!loading && (
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                            <AnimatePresence mode="popLayout">
                                {filteredRecipes.map((recipe, i) => (
                                    <RecipeCard
                                        key={recipe._id}
                                        recipe={recipe}
                                        index={i}
                                        onClick={setSelectedRecipe}
                                    />
                                ))}
                            </AnimatePresence>

                            {filteredRecipes.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full text-center py-24"
                                >
                                    <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
                                        <ChefHat className="w-10 h-10 text-stone-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-stone-400 mb-1">No recipes yet</h3>
                                    <p className="text-stone-300 text-sm">We're cooking up new recipes for this category.</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ─── BOTTOM TRUST BAR ─── */}
                    {!loading && filteredRecipes.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-16 flex items-center justify-center gap-8 text-stone-300 text-[10px] font-bold uppercase tracking-[0.2em]"
                        >
                            <span className="flex items-center gap-2"><ChefHat className="w-4 h-4" /> Chef Curated</span>
                            <span className="w-1 h-1 rounded-full bg-stone-200" />
                            <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Premium Recipes</span>
                            <span className="w-1 h-1 rounded-full bg-stone-200" />
                            <span className="flex items-center gap-2"><Heart className="w-4 h-4" /> Made with Love</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* ─── LIVING COOKBOOK OVERLAY ─── */}
            <AnimatePresence>
                {selectedRecipe && (
                    <LivingCookbook
                        recipe={selectedRecipe}
                        onClose={() => setSelectedRecipe(null)}
                        onAddToCart={handleAddToCart}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default FreshGoKitchen;
