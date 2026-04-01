import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Truck, Sparkles, Heart, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Scene = ({ title, sub, icon: Icon, color, index }) => {
    return (
        <div className="h-screen w-screen flex-shrink-0 flex flex-col items-center justify-center px-12 text-center relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                className={`w-40 h-40 rounded-full ${color} flex items-center justify-center mb-12 shadow-2xl relative z-10`}
            >
                <Icon className="w-20 h-20 text-white" />
                <div className="absolute inset-0 rounded-full animate-ping bg-white/20 -z-10" />
            </motion.div>

            <h2 className="text-[10vw] font-black text-slate-900 leading-none uppercase tracking-tighter mb-8 z-10">{title}</h2>
            <p className="text-3xl font-medium text-slate-500 max-w-4xl z-10">{sub}</p>

            <span className="absolute bottom-20 text-slate-200 font-black text-[20vw] -z-0 opacity-50 select-none">0{index + 1}</span>
        </div>
    );
};

const StoryMode = () => {
    const componentRef = useRef();
    const scrollerRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        let ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('.story-section');
            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: scrollerRef.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (sections.length - 1),
                    end: () => "+=" + scrollerRef.current.offsetWidth
                }
            });
        }, componentRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={componentRef} className="bg-white selection:bg-primary selection:text-white">
            {/* Top Navigation */}
            <div className="fixed top-0 left-0 w-full p-12 z-[100] flex justify-between items-center pointer-events-none">
                <button
                    onClick={() => navigate('/')}
                    className="pointer-events-auto bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-slate-200 px-8 py-3 rounded-full shadow-xl">
                    <span className="text-slate-900 font-black uppercase text-[10px] tracking-widest">Story of FreshGo</span>
                </div>
                <div className="w-14" /> {/* Spacer */}
            </div>

            <div ref={scrollerRef} className="h-screen w-full flex flex-nowrap overflow-hidden">
                <div className="story-section h-screen w-screen flex-shrink-0 relative">
                    <Scene
                        index={0}
                        title="The Vision"
                        sub="In a world of mass-produced food, we reclaimed the purity of the source. Every seed tells a story of health."
                        icon={Sparkles}
                        color="bg-primary"
                    />
                </div>
                <div className="story-section h-screen w-screen flex-shrink-0 relative">
                    <Scene
                        index={1}
                        title="Elite Sourcing"
                        sub="We travel the globe for the top 1% of organic items. No compromise, only pure diamond-grade quality."
                        icon={ShieldCheck}
                        color="bg-blue-500"
                    />
                </div>
                <div className="story-section h-screen w-screen flex-shrink-0 relative">
                    <Scene
                        index={2}
                        title="Magic Delivery"
                        sub="Our logistics chamber ensures your groceries fly to your home with unmatched speed and care."
                        icon={Truck}
                        color="bg-orange-500"
                    />
                </div>
                <div className="story-section h-screen w-screen flex-shrink-0 relative">
                    <Scene
                        index={3}
                        title="Your Legacy"
                        sub="Every purchase is an investment in your health identity. This isn't shopping—it's evolution."
                        icon={Heart}
                        color="bg-red-500"
                    />
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 text-slate-400 font-bold uppercase text-[10px] tracking-[0.5em] animate-pulse">
                Scroll to Reveal the Origin
            </div>
        </div>
    );
};

export default StoryMode;
