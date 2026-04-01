import { motion } from 'framer-motion';

export const WorldLayout = ({ children, gradientFrom = "#f8fafc", gradientTo = "#ecfdf5" }) => {
    return (
        <div className="relative min-h-screen text-slate-900 overflow-x-hidden">
            {/* Cinematic Background */}
            <div
                className="fixed inset-0 -z-10 transition-colors duration-1000"
                style={{
                    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
                }}
            />

            {/* Universal Floating Particles */}
            <div className="fixed inset-0 pointer-events-none -z-5 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: '100vh', opacity: 0 }}
                        animate={{
                            y: '-10vh',
                            opacity: [0, 0.5, 0],
                            x: `${Math.random() * 100}vw`
                        }}
                        transition={{
                            duration: 10 + Math.random() * 20,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10
                        }}
                        className="absolute w-1 h-1 bg-primary/20 rounded-full blur-[1px]"
                    />
                ))}
            </div>

            <main className="relative z-10">
                {children}
            </main>
        </div>
    );
};

export const GlassPortal = ({ children, className = "" }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className={`backdrop-blur-xl bg-white/40 border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2.5rem] p-8 ${className}`}
        >
            {children}
        </motion.div>
    );
};
