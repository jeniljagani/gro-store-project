import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Search, Menu, X, LogOut, Heart, Wallet as WalletIcon, Package } from 'lucide-react';
import { logout, reset } from '../../redux/slices/authSlice';
import { getWalletBalance } from '../../redux/slices/walletSlice';
import { motion, AnimatePresence } from 'framer-motion';
import CartSidebar from '../cart/CartSidebar';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const { favoriteIds } = useSelector((state) => state.favorites);
    const { balance } = useSelector((state) => state.wallet);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        if (user?.token) {
            dispatch(getWalletBalance());
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, [user, dispatch]);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-3 glass mt-2 mx-auto left-0 right-0 max-w-[95%] rounded-2xl' : 'py-5 bg-transparent'
            }`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                    <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        🌿
                    </span>
                    FreshGo
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-12">
                    <Link to="/" data-cursor="World" className="text-sm font-black uppercase tracking-[0.3em] hover:text-primary transition-all">Home</Link>
                    <Link to="/shop" data-cursor="Explore" className="text-sm font-black uppercase tracking-[0.3em] hover:text-primary transition-all">Shop</Link>
                    <Link to="/recipes" data-cursor="Taste" className="text-sm font-black uppercase tracking-[0.3em] hover:text-primary transition-all">Recipes</Link>
                    <Link to="/walkthrough" data-cursor="Story" className="text-sm font-black uppercase tracking-[0.3em] hover:text-primary transition-all">Doc</Link>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    {user && (
                        <Link to="/orders" data-cursor="Orders" className="relative group p-3 bg-white shadow-xl rounded-2xl">
                            <Package className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                        </Link>
                    )}
                    <Link to="/favorites" data-cursor="Room" className="relative group p-3 bg-white shadow-xl rounded-2xl">
                        <Heart className={`w-5 h-5 transition-colors ${favoriteIds.length > 0 ? 'text-red-500 fill-current' : 'text-slate-400 group-hover:text-red-500'}`} />
                        {favoriteIds.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                                {favoriteIds.length}
                            </span>
                        )}
                    </Link>
                    <Link to="/cart" data-cursor="Chamber" className="relative group p-3 bg-slate-900 shadow-xl rounded-2xl">
                        <ShoppingCart className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                            {cartItems?.length || 0}
                        </span>
                    </Link>
                    {user && (
                        <Link to="/wallet" data-cursor="Bank" className="flex items-center gap-2 p-2 px-4 bg-white shadow-xl rounded-2xl border border-primary/10 hover:border-primary/30 transition-all">
                            <WalletIcon className="w-4 h-4 text-primary" />
                            <span className="text-xs font-black text-slate-800">₹{balance.toLocaleString()}</span>
                        </Link>
                    )}

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {user.name[0]}
                                </div>
                            </Link>
                            <button onClick={onLogout} className="text-slate-600 hover:text-red-500">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary">Login</Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden glass absolute top-full left-0 w-full p-6 space-y-4"
                    >
                        <Link to="/" className="block text-lg font-medium">Home</Link>
                        <Link to="/shop" className="block text-lg font-medium">Shop</Link>
                        <Link to="/recipes" className="block text-lg font-medium">Recipes</Link>
                        {user && <Link to="/wallet" className="block text-lg font-medium">Wallet (₹{balance})</Link>}
                        {user && <Link to="/orders" className="block text-lg font-medium">My Orders</Link>}
                        <Link to="/login" className="btn-primary inline-block">Login</Link>
                    </motion.div>
                )}
            </AnimatePresence>

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </nav>
    );
};


export default Navbar;
