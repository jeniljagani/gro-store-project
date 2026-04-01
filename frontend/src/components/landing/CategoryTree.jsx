import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
    { name: 'Vegetables', emoji: '🥬', color: '#22c55e', glow: 'rgba(34,197,94,0.4)', branch: 'left-top' },
    { name: 'Fruits', emoji: '🍎', color: '#ef4444', glow: 'rgba(239,68,68,0.4)', branch: 'right-top' },
    { name: 'Dairy', emoji: '🥛', color: '#3b82f6', glow: 'rgba(59,130,246,0.4)', branch: 'left-mid' },
    { name: 'Snacks', emoji: '🍿', color: '#f97316', glow: 'rgba(249,115,22,0.4)', branch: 'right-mid' },
    { name: 'Beverages', emoji: '🧃', color: '#8b5cf6', glow: 'rgba(139,92,246,0.4)', branch: 'left-low' },
    { name: 'Personal Care', emoji: '✨', color: '#ec4899', glow: 'rgba(236,72,153,0.4)', branch: 'right-low' },
];

const FruitNode = ({ cat, index, side, yPos }) => {
    const navigate = useNavigate();
    const isLeft = side === 'left';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, x: isLeft ? -60 : 60 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: index * 0.12, type: 'spring', damping: 12, stiffness: 100 }}
            className="absolute flex items-center gap-5 group cursor-pointer"
            style={{
                top: yPos,
                [isLeft ? 'right' : 'left']: '50%',
                [isLeft ? 'marginRight' : 'marginLeft']: '60px',
                flexDirection: isLeft ? 'row-reverse' : 'row',
            }}
            onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
        >
            {/* Branch connector line */}
            <div
                className="hidden md:block h-[2px] group-hover:w-20 transition-all duration-500"
                style={{
                    width: '40px',
                    background: `linear-gradient(${isLeft ? 'to left' : 'to right'}, ${cat.color}, transparent)`,
                }}
            />

            {/* The fruit node */}
            <motion.div
                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                transition={{ type: 'spring', damping: 10 }}
                className="relative"
            >
                {/* Glow ring */}
                <div
                    className="absolute inset-[-8px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
                    style={{ background: cat.glow }}
                />
                {/* Fruit body */}
                <div
                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-xl border-2 border-white/20 backdrop-blur-sm z-10 group-hover:shadow-2xl transition-shadow duration-300"
                    style={{ background: `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)` }}
                >
                    <span className="text-3xl md:text-4xl drop-shadow-lg select-none">{cat.emoji}</span>
                </div>
                {/* Stem */}
                <div
                    className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-[3px] h-4 rounded-full"
                    style={{ background: '#8B6914' }}
                />
            </motion.div>

            {/* Label */}
            <div className={`${isLeft ? 'text-right' : 'text-left'}`}>
                <p className="text-lg md:text-xl font-black text-slate-800 group-hover:text-primary transition-colors uppercase tracking-wider">
                    {cat.name}
                </p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all">
                    Explore →
                </p>
            </div>
        </motion.div>
    );
};

const CategoryTree = () => {
    const containerRef = useRef();
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const treeScale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);
    const treeOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

    const yPositions = ['8%', '24%', '42%', '58%', '72%', '86%'];

    return (
        <div ref={containerRef} className="min-h-screen py-20 md:py-32 relative bg-gradient-to-b from-white via-green-50/30 to-white overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-primary font-black text-sm uppercase tracking-[0.3em] mb-4">Organic Collection</p>
                        <h2 className="text-5xl md:text-8xl font-black text-slate-900 mb-4">
                            The <span className="text-primary">Living</span> Tree
                        </h2>
                        <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto font-medium">
                            Each category grows from our roots of quality. Tap a fruit to explore.
                        </p>
                    </motion.div>
                </div>

                {/* Tree Container */}
                <motion.div
                    style={{ scale: treeScale, opacity: treeOpacity }}
                    className="relative w-full max-w-5xl mx-auto"
                // min height for the tree
                // Use aspect ratio to keep proportions
                >
                    <div className="relative" style={{ minHeight: '700px' }}>
                        {/* === THE SVG TREE === */}
                        <svg
                            viewBox="0 0 400 800"
                            className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-auto"
                            style={{ maxWidth: '200px' }}
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {/* Roots */}
                            <g opacity="0.3">
                                <path d="M200 780 Q160 800 120 810" stroke="#8B6914" strokeWidth="4" fill="none" />
                                <path d="M200 780 Q220 810 260 820" stroke="#8B6914" strokeWidth="3" fill="none" />
                                <path d="M200 780 Q180 810 170 830" stroke="#8B6914" strokeWidth="2.5" fill="none" />
                                <path d="M200 780 Q240 800 280 810" stroke="#8B6914" strokeWidth="2" fill="none" />
                            </g>

                            {/* Main Trunk */}
                            <path
                                d="M195 780 C190 650, 210 500, 200 350 C195 250, 205 150, 200 60"
                                stroke="url(#trunkGrad)"
                                strokeWidth="18"
                                fill="none"
                                strokeLinecap="round"
                            />
                            {/* Trunk highlight */}
                            <path
                                d="M200 780 C205 650, 198 500, 203 350 C206 250, 200 150, 202 60"
                                stroke="url(#trunkHighlight)"
                                strokeWidth="6"
                                fill="none"
                                strokeLinecap="round"
                                opacity="0.3"
                            />

                            {/* Branches — left */}
                            <path d="M200 120 Q160 90 100 70" stroke="#6B5310" strokeWidth="6" fill="none" strokeLinecap="round" />
                            <path d="M200 300 Q150 260 80 250" stroke="#6B5310" strokeWidth="5" fill="none" strokeLinecap="round" />
                            <path d="M200 520 Q160 500 90 490" stroke="#6B5310" strokeWidth="4.5" fill="none" strokeLinecap="round" />

                            {/* Branches — right */}
                            <path d="M200 210 Q250 180 310 170" stroke="#6B5310" strokeWidth="5.5" fill="none" strokeLinecap="round" />
                            <path d="M200 420 Q260 390 320 380" stroke="#6B5310" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                            <path d="M200 630 Q250 610 300 600" stroke="#6B5310" strokeWidth="4" fill="none" strokeLinecap="round" />

                            {/* Leaf clusters */}
                            {[
                                { cx: 80, cy: 60 }, { cx: 120, cy: 50 }, { cx: 100, cy: 80 },
                                { cx: 300, cy: 160 }, { cx: 320, cy: 145 }, { cx: 290, cy: 180 },
                                { cx: 70, cy: 240 }, { cx: 95, cy: 230 }, { cx: 60, cy: 260 },
                                { cx: 310, cy: 370 }, { cx: 330, cy: 355 }, { cx: 295, cy: 390 },
                                { cx: 80, cy: 480 }, { cx: 100, cy: 470 }, { cx: 70, cy: 500 },
                                { cx: 290, cy: 590 }, { cx: 310, cy: 580 }, { cx: 280, cy: 610 },
                                // crown leaves
                                { cx: 170, cy: 40 }, { cx: 230, cy: 35 }, { cx: 200, cy: 20 },
                                { cx: 160, cy: 55 }, { cx: 240, cy: 50 },
                            ].map((leaf, i) => (
                                <ellipse
                                    key={i}
                                    cx={leaf.cx}
                                    cy={leaf.cy}
                                    rx={12 + Math.random() * 6}
                                    ry={8 + Math.random() * 4}
                                    fill="#22c55e"
                                    opacity={0.2 + Math.random() * 0.25}
                                    transform={`rotate(${-30 + Math.random() * 60} ${leaf.cx} ${leaf.cy})`}
                                />
                            ))}

                            {/* Gradient Definitions */}
                            <defs>
                                <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6B5310" />
                                    <stop offset="50%" stopColor="#8B6914" />
                                    <stop offset="100%" stopColor="#A0854A" />
                                </linearGradient>
                                <linearGradient id="trunkHighlight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#D4A843" />
                                    <stop offset="100%" stopColor="#8B6914" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Category Fruit Nodes */}
                        {categories.map((cat, i) => (
                            <FruitNode
                                key={cat.name}
                                cat={cat}
                                index={i}
                                side={i % 2 === 0 ? 'left' : 'right'}
                                yPos={yPositions[i]}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Background soil gradient at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-900/5 to-transparent" />

            {/* Floating leaf particles */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-green-300/30 text-xl pointer-events-none select-none"
                    style={{
                        top: `${15 + Math.random() * 70}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, 30, 0],
                        x: [0, 15, -10, 0],
                        rotate: [0, 180, 360],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 6 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: 'easeInOut',
                    }}
                >
                    🍃
                </motion.div>
            ))}
        </div>
    );
};

export default CategoryTree;
