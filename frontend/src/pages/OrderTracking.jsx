import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { Package, Check, Truck, ChefHat, Clock, MapPin, ArrowLeft, Star, IndianRupee } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const deliveryIcon = L.divIcon({
    className: '',
    html: `<div style="width:52px;height:52px;background:linear-gradient(135deg,#f97316,#ea580c);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 4px 24px rgba(249,115,22,0.6);border:3px solid white;animation:deliveryPulse 1.5s infinite;">🛵</div>`,
    iconSize: [52, 52],
    iconAnchor: [26, 26],
});

const storeIcon = L.divIcon({
    className: '',
    html: `<div style="width:46px;height:46px;background:linear-gradient(135deg,#22c55e,#16a34a);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 20px rgba(34,197,94,0.5);border:3px solid white;">🏪</div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
});

const homeIcon = L.divIcon({
    className: '',
    html: `<div style="width:46px;height:46px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 20px rgba(139,92,246,0.5);border:3px solid white;">🏠</div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
});

function DynamicMap({ deliveryPos }) {
    const map = useMap();
    useEffect(() => {
        if (deliveryPos) map.panTo(deliveryPos, { animate: true, duration: 1 });
    }, [deliveryPos, map]);
    return null;
}

const STATUS_STEPS = [
    { key: 'pending',          label: 'Order Placed',      icon: Package, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    { key: 'confirmed',        label: 'Confirmed',         icon: Check,   color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    { key: 'preparing',        label: 'Preparing Order',   icon: ChefHat, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { key: 'out_for_delivery', label: 'Out for Delivery',  icon: Truck,   color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
    { key: 'delivered',        label: 'Delivered! 🎉',     icon: Star,    color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
];

// Surat, Gujarat, India coordinates
const STORE_POS  = { lat: 21.1702, lng: 72.8311 }; // Surat city centre (store)
const DEST_POS   = { lat: 21.1950, lng: 72.8600 }; // Nearby delivery drop

export default function OrderTracking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(s => s.auth);

    const [order,         setOrder]         = useState(null);
    const [loading,       setLoading]       = useState(true);
    const [deliveryPos,   setDeliveryPos]   = useState(null);
    const [currentStatus, setCurrentStatus] = useState('pending');
    const socketRef = useRef(null);

    useEffect(() => { fetchOrder(); setupSocket(); return () => socketRef.current?.disconnect(); }, [id]);

    const fetchOrder = async () => {
        try {
            const res  = await fetch(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${user?.token}` } });
            const data = await res.json();
            setOrder(data);
            setCurrentStatus(data.status || 'pending');
            setDeliveryPos(data.deliveryLocation?.lat ? data.deliveryLocation : STORE_POS);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const setupSocket = () => {
        const socket = io();
        socketRef.current = socket;
        socket.on('connect', () => socket.emit('joinOrder', id));
        socket.on('orderUpdate', (data) => {
            setCurrentStatus(data.status);
            if (data.deliveryLocation?.lat) setDeliveryPos(data.deliveryLocation);
        });
        socket.on('locationUpdate', loc => setDeliveryPos({ lat: loc.lat, lng: loc.lng }));
    };

    const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === currentStatus);
    const currentStep      = STATUS_STEPS[currentStepIndex] || STATUS_STEPS[0];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
            <div className="text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl" style={{ background: 'rgba(249,115,22,0.2)', border: '2px solid rgba(249,115,22,0.4)' }}>🛵</div>
                <p className="text-white/60 font-bold uppercase tracking-widest text-sm animate-pulse">Loading your order...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-20" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
            <style>{`
                @keyframes deliveryPulse {
                    0%,100% { transform:scale(1); box-shadow:0 4px 24px rgba(249,115,22,0.6); }
                    50% { transform:scale(1.15); box-shadow:0 8px 36px rgba(249,115,22,0.9); }
                }
                .leaflet-container { border-radius: 0 0 1.5rem 1.5rem; }
            `}</style>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/orders')}
                        className="p-3 rounded-2xl transition-all hover:scale-105"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Track Order</h1>
                        <p className="text-white/40 font-mono text-sm">#{order?._id?.slice(-8).toUpperCase()}</p>
                    </div>
                    {/* Live Badge */}
                    {!['delivered','cancelled'].includes(currentStatus) && (
                        <motion.div animate={{ opacity:[0.6,1,0.6] }} transition={{ repeat:Infinity, duration:1.8 }}
                            className="ml-auto px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2"
                            style={{ background:'rgba(249,115,22,0.15)', border:'1.5px solid rgba(249,115,22,0.4)', color:'#f97316' }}>
                            <span className="w-2 h-2 rounded-full bg-orange-400" />
                            Live Tracking
                        </motion.div>
                    )}
                </div>

                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Left Col: Status + Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Status Hero Card */}
                        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                            className="rounded-3xl p-6 text-center"
                            style={{ background: `linear-gradient(135deg, ${currentStep.bg}, rgba(255,255,255,0.03))`, border:`1.5px solid ${currentStep.color}33` }}>
                            <motion.div
                                animate={{ scale:[1,1.08,1] }} transition={{ repeat:Infinity, duration:2.5 }}
                                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                                style={{ background:currentStep.bg, border:`2px solid ${currentStep.color}55` }}>
                                <currentStep.icon className="w-9 h-9" style={{ color:currentStep.color }} />
                            </motion.div>
                            <p className="font-black text-2xl text-white mb-1">{currentStep.label}</p>
                            <p className="text-white/40 text-sm">
                                {currentStatus === 'out_for_delivery' ? 'Your rider is on the way! 🛵' :
                                 currentStatus === 'delivered' ? 'Enjoy your groceries! ✨' :
                                 currentStatus === 'preparing' ? 'Store is packing your order...' :
                                 currentStatus === 'confirmed' ? 'Order accepted by store' : 'Order received'}
                            </p>
                        </motion.div>

                        {/* Timeline */}
                        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                            className="rounded-3xl p-6"
                            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                            <h2 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6">Order Journey</h2>
                            <div className="relative">
                                <div className="absolute left-5 top-2 bottom-2 w-0.5" style={{ background:'rgba(255,255,255,0.08)' }} />
                                <div className="absolute left-5 top-2 w-0.5 transition-all duration-1000"
                                    style={{ height:`${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`, background:`linear-gradient(to bottom, #8b5cf6, ${currentStep.color})` }} />

                                <div className="space-y-5">
                                    {STATUS_STEPS.map((step, i) => {
                                        const isCompleted = i <= currentStepIndex;
                                        const isActive    = i === currentStepIndex;
                                        const Icon = step.icon;
                                        return (
                                            <div key={step.key} className="flex items-center gap-4 relative">
                                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500"
                                                    style={{
                                                        background: isCompleted ? step.bg : 'rgba(255,255,255,0.04)',
                                                        border: `2px solid ${isCompleted ? step.color : 'rgba(255,255,255,0.08)'}`,
                                                        boxShadow: isActive ? `0 0 16px ${step.color}55` : 'none'
                                                    }}>
                                                    <Icon className="w-4 h-4" style={{ color: isCompleted ? step.color : 'rgba(255,255,255,0.15)' }} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm" style={{ color: isCompleted ? '#fff' : 'rgba(255,255,255,0.2)' }}>{step.label}</p>
                                                    {isActive && currentStatus !== 'delivered' && (
                                                        <motion.p animate={{ opacity:[0.5,1,0.5] }} transition={{ repeat:Infinity, duration:1.5 }}
                                                            className="text-xs font-bold" style={{ color:step.color }}>● In progress</motion.p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Items */}
                        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                            className="rounded-3xl p-6"
                            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                            <h2 className="text-xs font-black text-white/40 uppercase tracking-widest mb-5">Items</h2>
                            <div className="space-y-3">
                                {order?.orderItems?.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                                        <div className="flex-grow min-w-0">
                                            <p className="text-white font-bold text-sm truncate">{item.name}</p>
                                            <p className="text-white/30 text-xs">x{item.qty}</p>
                                        </div>
                                        <p className="text-orange-400 font-black font-mono text-sm">₹{(item.price * item.qty).toFixed(0)}</p>
                                    </div>
                                ))}
                                <div className="pt-3 border-t flex justify-between items-center" style={{ borderColor:'rgba(255,255,255,0.08)' }}>
                                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Total Paid</p>
                                    <p className="text-white font-black text-lg">₹{order?.totalPrice?.toFixed(0)}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Col: Map */}
                    <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.1 }}
                        className="lg:col-span-3 rounded-3xl overflow-hidden"
                        style={{ minHeight:'560px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                        {/* Map Header */}
                        <div className="p-5 flex items-center gap-3" style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background:'rgba(249,115,22,0.15)', border:'1.5px solid rgba(249,115,22,0.3)' }}>
                                <MapPin className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                                <p className="font-black text-white text-sm uppercase tracking-wider">Live Map · Surat, Gujarat</p>
                                <p className="text-white/30 text-xs">
                                    {currentStatus === 'out_for_delivery' ? '🛵 Rider is moving towards you' : 'Tracking will activate when out for delivery'}
                                </p>
                            </div>
                            {/* Legend */}
                            <div className="ml-auto flex items-center gap-3 text-xs text-white/30">
                                <span>🏪 Store</span>
                                <span>🏠 You</span>
                                {currentStatus === 'out_for_delivery' && <span>🛵 Rider</span>}
                            </div>
                        </div>

                        {deliveryPos && (
                            <div style={{ height:'calc(100% - 76px)', minHeight:'484px' }}>
                                <MapContainer center={[deliveryPos.lat, deliveryPos.lng]} zoom={13} style={{ height:'100%', width:'100%' }}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Polyline
                                        positions={[[STORE_POS.lat, STORE_POS.lng],[DEST_POS.lat, DEST_POS.lng]]}
                                        color="#f97316" weight={4} opacity={0.5} dashArray="10,8"
                                    />
                                    <Marker position={[STORE_POS.lat, STORE_POS.lng]} icon={storeIcon}>
                                        <Popup><b>🏪 FreshGo Store</b><br/>Surat City Centre</Popup>
                                    </Marker>
                                    <Marker position={[DEST_POS.lat, DEST_POS.lng]} icon={homeIcon}>
                                        <Popup><b>🏠 Your Location</b><br/>Delivery Address</Popup>
                                    </Marker>
                                    {(currentStatus === 'out_for_delivery' || currentStatus === 'delivered') && (
                                        <Marker position={[deliveryPos.lat, deliveryPos.lng]} icon={deliveryIcon}>
                                            <Popup><b>🛵 Your Delivery Partner</b><br/>On the way!</Popup>
                                        </Marker>
                                    )}
                                    <DynamicMap deliveryPos={currentStatus === 'out_for_delivery' ? [deliveryPos.lat, deliveryPos.lng] : null} />
                                </MapContainer>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
