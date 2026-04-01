import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
    const { cartItems } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-full max-w-md bg-white/10 backdrop-blur-3xl border-l border-white/20 z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Your Haul</h3>
                                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">{cartItems.length} Items Locked</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-4 rounded-2xl hover:bg-white/10 transition-colors text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            {cartItems.length > 0 ? (
                                cartItems.map((item, i) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-6 p-4 rounded-3xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all"
                                    >
                                        <div className="w-20 h-20 rounded-2xl bg-slate-800 overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>

                                        <div className="flex-grow">
                                            <h4 className="text-white font-black uppercase text-sm tracking-wide mb-1 leading-tight">{item.name}</h4>
                                            <p className="text-primary font-bold font-mono text-sm mb-3">${item.price}</p>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ id: item._id, qty: Math.max(1, item.qty - 1) }))}
                                                        className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-white font-black text-xs w-4 text-center">{item.qty}</span>
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ id: item._id, qty: item.qty + 1 }))}
                                                        className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => dispatch(removeFromCart(item._id))}
                                                    className="p-2 text-white/20 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                    <ShoppingBag className="w-20 h-20 mb-6 text-white" />
                                    <p className="text-white font-black uppercase tracking-widest">Chamber is Empty</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-8 bg-white/5 border-t border-white/10">
                                <div className="flex justify-between items-end mb-8">
                                    <p className="text-white/40 font-bold uppercase text-xs tracking-[0.2em]">Total Value</p>
                                    <p className="text-4xl text-white font-black tracking-tighter">${subtotal}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate('/checkout');
                                    }}
                                    className="w-full py-6 bg-primary rounded-[2rem] text-white font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)] flex items-center justify-center gap-4 group hover:scale-105 transition-all active:scale-95"
                                >
                                    Initialize Checkout
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full mt-4 py-4 text-white/40 font-bold uppercase text-[10px] tracking-[0.3em] hover:text-white transition-colors"
                                >
                                    Continue Exploring
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
