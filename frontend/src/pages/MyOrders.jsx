import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Package, Truck, Check, Clock, ChefHat, MapPin, Star, ArrowRight, ShoppingBag, Plus } from 'lucide-react';

const STATUS_CONFIG = {
    pending:          { label: 'Pending',          color: '#8b5cf6', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', icon: Clock },
    confirmed:        { label: 'Confirmed',         color: '#22c55e', gradient: 'linear-gradient(135deg,#22c55e,#16a34a)', icon: Check },
    preparing:        { label: 'Preparing',         color: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', icon: ChefHat },
    out_for_delivery: { label: 'Out for Delivery',  color: '#f97316', gradient: 'linear-gradient(135deg,#f97316,#ea580c)', icon: Truck },
    delivered:        { label: 'Delivered ✓',       color: '#22c55e', gradient: 'linear-gradient(135deg,#22c55e,#16a34a)', icon: Star },
    cancelled:        { label: 'Cancelled',         color: '#ef4444', gradient: 'linear-gradient(135deg,#ef4444,#dc2626)', icon: Package },
};

export default function MyOrders() {
    const navigate = useNavigate();
    const { user }  = useSelector(s => s.auth);
    const [orders,  setOrders]  = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res  = await fetch('/api/orders/myorders', { headers: { Authorization: `Bearer ${user?.token}` } });
            const data = await res.json();
            setOrders(data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }}>
            <div className="text-center">
                <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1, ease:'linear' }}
                    className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-t-orange-400"
                    style={{ borderColor:'rgba(255,255,255,0.1)', borderTopColor:'#f97316' }} />
                <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Loading orders...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-20 pb-16" style={{ background:'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)' }}>
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} className="mb-10">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">Your History</p>
                            <h1 className="text-4xl font-black uppercase tracking-tighter"
                                style={{ background:'linear-gradient(135deg,#f97316,#f59e0b)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                                My Orders
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-black text-white">{Array.isArray(orders) ? orders.length : 0}</p>
                            <p className="text-white/30 text-xs uppercase tracking-widest">Total Orders</p>
                        </div>
                    </div>
                    {/* Stats bar */}
                    {Array.isArray(orders) && orders.length > 0 && (
                        <div className="mt-6 grid grid-cols-3 gap-3">
                            {[
                                { label:'Active',    value: orders.filter(o => !['delivered','cancelled'].includes(o.status)).length, color:'#f97316' },
                                { label:'Delivered', value: orders.filter(o => o.status === 'delivered').length,                      color:'#22c55e' },
                                { label:'Spent',     value: `₹${orders.reduce((a,o)=>a+o.totalPrice,0).toLocaleString('en-IN')}`,    color:'#8b5cf6' },
                            ].map(stat => (
                                <div key={stat.label} className="rounded-2xl p-4 text-center" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                                    <p className="text-xl font-black" style={{ color:stat.color }}>{stat.value}</p>
                                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-0.5">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {!Array.isArray(orders) || orders.length === 0 ? (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-24">
                        <div className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl"
                            style={{ background:'rgba(249,115,22,0.1)', border:'2px dashed rgba(249,115,22,0.3)' }}>
                            🛒
                        </div>
                        <p className="text-white/20 font-black uppercase tracking-widest text-xl mb-2">No orders yet</p>
                        <p className="text-white/10 text-sm mb-8">Start shopping to see your orders here</p>
                        <button onClick={() => navigate('/shop')}
                            className="flex items-center gap-2 mx-auto px-8 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-all"
                            style={{ background:'linear-gradient(135deg,#f97316,#ea580c)', boxShadow:'0 16px 40px rgba(249,115,22,0.35)' }}>
                            <Plus className="w-4 h-4" /> Start Shopping
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {Array.isArray(orders) && orders.map((order, i) => {
                            const cfg    = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                            const Icon   = cfg.icon;
                            const isLive = !['delivered','cancelled'].includes(order.status);

                            return (
                                <motion.div key={order._id}
                                    initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.07 }}
                                    className="rounded-3xl overflow-hidden group cursor-pointer hover:scale-[1.01] transition-all duration-300"
                                    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
                                    onClick={() => order.status !== 'cancelled' && navigate(`/orders/${order._id}/track`)}
                                >
                                    {/* Color top bar */}
                                    <div className="h-1" style={{ background: cfg.gradient }} />

                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                {/* Status Icon */}
                                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                                                    style={{ background:`${cfg.color}18`, border:`1.5px solid ${cfg.color}40` }}>
                                                    <Icon className="w-5 h-5" style={{ color:cfg.color }} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <p className="text-white font-black text-sm font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                                                        {isLive && (
                                                            <motion.span animate={{ opacity:[0.5,1,0.5] }} transition={{ repeat:Infinity, duration:1.8 }}
                                                                className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
                                                                style={{ background:`${cfg.color}18`, color:cfg.color, border:`1px solid ${cfg.color}40` }}>
                                                                ● Live
                                                            </motion.span>
                                                        )}
                                                    </div>
                                                    <p className="font-black uppercase text-xs tracking-widest mb-2" style={{ color:cfg.color }}>{cfg.label}</p>
                                                    <div className="flex items-center gap-3 text-xs text-white/30">
                                                        <span>{order.orderItems?.length} items</span>
                                                        <span>·</span>
                                                        <span className="font-black font-mono text-white/50">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                                                        <span>·</span>
                                                        <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {order.status !== 'cancelled' && (
                                                <button
                                                    onClick={e => { e.stopPropagation(); navigate(`/orders/${order._id}/track`); }}
                                                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl flex-shrink-0 font-black uppercase text-xs tracking-widest transition-all hover:scale-105"
                                                    style={{ background:`${cfg.color}18`, color:cfg.color, border:`1.5px solid ${cfg.color}40` }}>
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    Track
                                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Item Thumbnails */}
                                        <div className="flex gap-2 mt-4">
                                            {order.orderItems?.slice(0,5).map((item, j) => (
                                                <div key={j} className="w-10 h-10 rounded-xl overflow-hidden border" style={{ borderColor:'rgba(255,255,255,0.08)' }}>
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {order.orderItems?.length > 5 && (
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white/30"
                                                    style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
                                                    +{order.orderItems.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
