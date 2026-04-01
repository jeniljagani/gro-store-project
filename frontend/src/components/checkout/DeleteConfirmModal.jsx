import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, loading }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[80]" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="fixed inset-0 z-[90] flex items-center justify-center p-4"
                >
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <Trash2 className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Delete Address?</h3>
                        <p className="text-sm text-slate-400 mb-8">This action cannot be undone. Are you sure you want to remove this address?</p>
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 py-3.5 bg-slate-100 rounded-2xl font-bold text-slate-600 text-sm hover:bg-slate-200 transition-colors">
                                Cancel
                            </button>
                            <motion.button whileTap={{ scale: 0.95 }} onClick={onConfirm} disabled={loading}
                                className="flex-1 py-3.5 bg-red-500 rounded-2xl font-bold text-white text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-100">
                                {loading ? 'Deleting...' : 'Yes, Delete'}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

export default DeleteConfirmModal;
