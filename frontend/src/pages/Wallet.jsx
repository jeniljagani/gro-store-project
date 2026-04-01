import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
    Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft,
    ChevronRight, CreditCard, Smartphone, Banknote, Shield,
    Clock, RefreshCcw, Gift, Zap
} from 'lucide-react';
import { getWalletBalance, addMoneyToWallet, resetWalletStatus, getWalletTransactions } from '../redux/slices/walletSlice';
import { toast } from 'react-hot-toast';

const Wallet = () => {
    const dispatch = useDispatch();
    const { balance, transactions, loading, error, success } = useSelector(state => state.wallet);
    const [amountToAdd, setAmountToAdd] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('upi');

    useEffect(() => {
        dispatch(getWalletBalance());
        dispatch(getWalletTransactions());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            toast.success('Money added to wallet successfully!');
            setAmountToAdd('');
            setIsAdding(false);
            dispatch(resetWalletStatus());
            dispatch(getWalletTransactions());
        }
        if (error) {
            toast.error(error);
            dispatch(resetWalletStatus());
        }
    }, [success, error, dispatch]);

    const quickAmounts = [100, 200, 500, 1000];

    const handleAddMoney = async () => {
        if (!amountToAdd || isNaN(amountToAdd) || amountToAdd <= 0) {
            return toast.error('Please enter a valid amount');
        }
        setIsAdding(true);
        // Simulate a small delay for "payment processing"
        setTimeout(() => {
            dispatch(addMoneyToWallet(Number(amountToAdd)));
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">FreshGo Wallet</h1>
                    <p className="text-slate-500 font-medium italic">Seamless payments, instant refunds, and exclusive rewards</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ═══ Left: Balance & Add Money ═══ */}
                    <div className="space-y-6">
                        {/* Balance Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative overflow-hidden bg-gradient-to-br from-primary to-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-green-200"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-10">
                                <WalletIcon className="w-48 h-48 -rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-8 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                                    <Shield className="w-3 h-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Balance</span>
                                </div>

                                <span className="text-sm font-bold text-white/70 block mb-1">Available Funds</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">₹</span>
                                    <motion.span
                                        key={balance}
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        className="text-6xl font-black"
                                    >
                                        {balance.toLocaleString()}
                                    </motion.span>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-white/60 mb-0.5">Wallet Rewards</p>
                                            <p className="text-sm font-black">₹50 Bonus Active</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ rotate: 180 }}
                                        onClick={() => dispatch(getWalletBalance())}
                                        className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
                                    >
                                        <RefreshCcw className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Add Money Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8"
                        >
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Plus className="w-6 h-6 text-primary" /> Top Up Wallet
                            </h2>

                            <div className="space-y-6">
                                {/* Amount Input */}
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Enter Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">₹</span>
                                        <input
                                            type="number"
                                            value={amountToAdd}
                                            onChange={(e) => setAmountToAdd(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full pl-12 pr-6 py-5 bg-slate-50 rounded-[1.5rem] text-2xl font-black text-slate-900 outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder:text-slate-200"
                                        />
                                    </div>
                                </div>

                                {/* Quick amounts */}
                                <div className="grid grid-cols-4 gap-2">
                                    {quickAmounts.map(amt => (
                                        <button
                                            key={amt}
                                            onClick={() => setAmountToAdd(amt)}
                                            className="py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all"
                                        >
                                            +₹{amt}
                                        </button>
                                    ))}
                                </div>

                                {/* Methods */}
                                <div className="space-y-3">
                                    {[
                                        { id: 'upi', label: 'UPI / GPay / PhonePe', icon: Smartphone },
                                        { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                                    ].map(method => (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedMethod === method.id
                                                ? 'border-primary bg-green-50/50'
                                                : 'border-slate-50 hover:border-slate-100'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedMethod === method.id ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                                                <method.icon className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-slate-700 flex-1 text-left">{method.label}</span>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'bg-primary border-primary' : 'border-slate-200'}`}>
                                                {selectedMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Proceed Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isAdding || loading}
                                    onClick={handleAddMoney}
                                    className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:bg-slate-400"
                                >
                                    {isAdding || loading ? (
                                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Proceed to Pay <ChevronRight className="w-5 h-5" /></>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* ═══ Right: Transactions ═══ */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full"
                    >
                        <div className="p-8 border-b border-slate-50">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-blue-500" /> Transaction History
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {transactions.length > 0 ? (
                                transactions.map(tx => (
                                    <div key={tx._id} className="p-4 bg-slate-50/50 rounded-2xl flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {tx.type === 'credit' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 text-sm">{tx.title}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                                                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 capitalize">{tx.status}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <Clock className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <p className="text-slate-400 font-bold text-sm">No transactions yet</p>
                                    <p className="text-slate-300 text-xs mt-1">Your wallet activity will appear here</p>
                                </div>
                            )}

                            <div className="pt-8 pb-4 text-center">
                                <p className="text-slate-300 font-bold text-xs uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2">
                                    <span className="w-8 h-[1px] bg-slate-100" /> End of records <span className="w-8 h-[1px] bg-slate-100" />
                                </p>
                                <div className="bg-blue-50 p-6 rounded-3xl inline-block border border-blue-100/50">
                                    <Gift className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                    <p className="text-[11px] font-bold text-blue-500 max-w-[180px] mx-auto leading-relaxed">
                                        Shop more to unlock exciting cashback rewards in your FreshGo Wallet!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
