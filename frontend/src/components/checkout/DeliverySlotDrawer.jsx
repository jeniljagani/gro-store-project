import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Check, ChevronRight } from 'lucide-react';

const timeSlots = [
    '07:00 AM - 09:00 AM',
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM',
    '07:00 PM - 09:00 PM',
];

const DeliverySlotDrawer = ({ isOpen, onClose, onSelect, currentSlot }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const dates = [];
    for (let i = 0; i < 3; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push({
            full: d.toISOString().split('T')[0],
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: d.getDate(),
            month: d.toLocaleDateString('en-US', { month: 'short' }),
            label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'long' })
        });
    }

    useEffect(() => {
        if (isOpen) {
            if (currentSlot) {
                setSelectedDate(currentSlot.date);
                setSelectedTime(currentSlot.time);
            } else {
                setSelectedDate(dates[0].full);
            }
        }
    }, [isOpen, currentSlot]);

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            onSelect({ date: selectedDate, time: selectedTime });
            onClose();
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
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-white z-[110] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <h2 className="font-black text-slate-900 text-lg">Schedule Delivery</h2>
                                    <p className="text-[11px] text-slate-400 font-medium">Select a date and time slot</p>
                                </div>
                            </div>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </motion.button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Date Selection */}
                            <div>
                                <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" /> Select Date
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {dates.map((d) => {
                                        const isActive = selectedDate === d.full;
                                        return (
                                            <motion.button
                                                key={d.full}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedDate(d.full)}
                                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${isActive
                                                        ? 'border-primary bg-green-50/50 shadow-lg shadow-green-100/50 text-primary'
                                                        : 'border-slate-100 hover:border-slate-200 text-slate-400'
                                                    }`}
                                            >
                                                <span className="text-[10px] font-bold uppercase tracking-wider">{d.day}</span>
                                                <span className="text-xl font-black">{d.date}</span>
                                                <span className="text-[10px] font-bold">{d.month}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slot Selection */}
                            <div>
                                <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" /> Select Time Slot
                                </h3>
                                <div className="space-y-2">
                                    {timeSlots.map((slot) => {
                                        const isActive = selectedTime === slot;
                                        return (
                                            <motion.button
                                                key={slot}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedTime(slot)}
                                                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${isActive
                                                        ? 'border-primary bg-green-50/50 text-primary'
                                                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                                    }`}
                                            >
                                                <span className="text-sm font-bold">{slot}</span>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'bg-primary border-primary' : 'border-slate-200'
                                                    }`}>
                                                    {isActive && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                            <motion.button
                                disabled={!selectedDate || !selectedTime}
                                whileHover={selectedDate && selectedTime ? { scale: 1.02 } : {}}
                                whileTap={selectedDate && selectedTime ? { scale: 0.98 } : {}}
                                onClick={handleConfirm}
                                className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-xl ${selectedDate && selectedTime
                                        ? 'bg-gradient-to-r from-primary to-emerald-400 text-white shadow-green-100'
                                        : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                                    }`}
                            >
                                Confirm Slot <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DeliverySlotDrawer;
