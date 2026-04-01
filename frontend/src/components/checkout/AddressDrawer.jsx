import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Home, Briefcase, Building2, Crosshair, Loader2, Check } from 'lucide-react';

const typeOptions = [
    { value: 'Home', icon: Home, label: 'Home' },
    { value: 'Work', icon: Briefcase, label: 'Work' },
    { value: 'Other', icon: Building2, label: 'Other' },
];

const emptyForm = { name: '', phone: '', pincode: '', state: '', city: '', house: '', area: '', landmark: '', type: 'Home', isDefault: false };

/* Floating Label Input */
const FloatingInput = ({ label, value, onChange, name, required, type = 'text', maxLength }) => (
    <div className="relative group">
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            placeholder=" "
            className="peer w-full px-4 pt-6 pb-2 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium text-slate-800 outline-none transition-all focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/5"
        />
        <label className="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary">
            {label}{required && ' *'}
        </label>
    </div>
);

const AddressDrawer = ({ isOpen, onClose, onSave, editAddress = null }) => {
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [locating, setLocating] = useState(false);
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editAddress) {
            setForm({ ...emptyForm, ...editAddress });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
    }, [editAddress, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    };

    // Auto-fill city/state from pincode
    useEffect(() => {
        if (form.pincode.length === 6) {
            setPincodeLoading(true);
            fetch(`https://api.postalpincode.in/pincode/${form.pincode}`)
                .then(r => r.json())
                .then(data => {
                    if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length) {
                        const po = data[0].PostOffice[0];
                        setForm(p => ({ ...p, city: po.District || p.city, state: po.State || p.state }));
                    }
                })
                .catch(() => { })
                .finally(() => setPincodeLoading(false));
        }
    }, [form.pincode]);

    // Geolocation
    const detectLocation = () => {
        if (!navigator.geolocation) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                    const data = await res.json();
                    const addr = data.address || {};
                    setForm(p => ({
                        ...p,
                        pincode: addr.postcode || p.pincode,
                        state: addr.state || p.state,
                        city: addr.city || addr.town || addr.village || p.city,
                        area: addr.suburb || addr.neighbourhood || addr.road || p.area,
                    }));
                } catch { } finally { setLocating(false); }
            },
            () => setLocating(false),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Required';
        if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone required';
        if (!form.pincode.trim() || form.pincode.length !== 6) e.pincode = '6-digit pincode required';
        if (!form.state.trim()) e.state = 'Required';
        if (!form.city.trim()) e.city = 'Required';
        if (!form.house.trim()) e.house = 'Required';
        if (!form.area.trim()) e.area = 'Required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        try {
            await onSave(form, editAddress?._id);
        } finally {
            setSaving(false);
        }
    };

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
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white z-[70] shadow-2xl overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white/90 backdrop-blur-xl z-10 px-6 py-5 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-slate-900 text-lg">{editAddress ? 'Edit Address' : 'Add Address'}</h2>
                                        <p className="text-[11px] text-slate-400 font-medium">Fill in your delivery details</p>
                                    </div>
                                </div>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
                                    className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </motion.button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Detect Location */}
                            <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={detectLocation} disabled={locating}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl text-blue-600 font-bold text-sm hover:bg-blue-100 transition-colors">
                                {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
                                {locating ? 'Detecting...' : 'Use Current Location'}
                            </motion.button>

                            {/* Name & Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <FloatingInput label="Full Name" name="name" value={form.name} onChange={handleChange} required />
                                    {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <FloatingInput label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required type="tel" maxLength={10} />
                                    {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.phone}</p>}
                                </div>
                            </div>

                            {/* Pincode, State, City */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <FloatingInput label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} required maxLength={6} />
                                    {pincodeLoading && <p className="text-[10px] text-blue-500 font-bold mt-1 ml-1">Fetching...</p>}
                                    {errors.pincode && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.pincode}</p>}
                                </div>
                                <div>
                                    <FloatingInput label="State" name="state" value={form.state} onChange={handleChange} required />
                                    {errors.state && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.state}</p>}
                                </div>
                                <div>
                                    <FloatingInput label="City" name="city" value={form.city} onChange={handleChange} required />
                                    {errors.city && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.city}</p>}
                                </div>
                            </div>

                            {/* House, Area */}
                            <div>
                                <FloatingInput label="House No / Building" name="house" value={form.house} onChange={handleChange} required />
                                {errors.house && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.house}</p>}
                            </div>
                            <div>
                                <FloatingInput label="Area / Street" name="area" value={form.area} onChange={handleChange} required />
                                {errors.area && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.area}</p>}
                            </div>
                            <FloatingInput label="Landmark (Optional)" name="landmark" value={form.landmark} onChange={handleChange} />

                            {/* Address Type */}
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Address Type</p>
                                <div className="flex gap-3">
                                    {typeOptions.map(opt => {
                                        const Icon = opt.icon;
                                        const active = form.type === opt.value;
                                        return (
                                            <motion.button key={opt.value} type="button" whileTap={{ scale: 0.93 }}
                                                onClick={() => setForm(p => ({ ...p, type: opt.value }))}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${active
                                                    ? 'border-primary bg-green-50 text-primary shadow-lg shadow-green-50'
                                                    : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                                                <Icon className="w-4 h-4" />
                                                {opt.label}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Default checkbox */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${form.isDefault ? 'bg-primary border-primary' : 'border-slate-200 group-hover:border-slate-300'}`}>
                                    {form.isDefault && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} className="hidden" />
                                <span className="text-sm font-medium text-slate-600">Set as default address</span>
                            </label>

                            {/* Save Button */}
                            <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                className={`w-full py-5 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${saving
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-primary to-emerald-400 text-white shadow-2xl shadow-green-200 hover:shadow-green-300'}`}>
                                {saving ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                                ) : (
                                    <><Check className="w-5 h-5" /> {editAddress ? 'Update Address' : 'Save Address'}</>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddressDrawer;
