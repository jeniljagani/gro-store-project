import { useRef } from 'react';
import { SmoothScroll, MouseFollower } from '../components/landing/GlobalSystems';
import Hero from '../components/landing/Hero';
import CategoryTree from '../components/landing/CategoryTree';
import RecipeStrip from '../components/landing/RecipeStrip';
import Recommendations from '../components/landing/Recommendations';
import AIAssistant from '../components/landing/AIAssistant';

const LandingPage = () => {
    return (
        <SmoothScroll>
            <MouseFollower />
            <div className="relative bg-[#f8fafc] text-slate-900 overflow-x-hidden">
                {/* Cinematic Background Gradient */}
                <div className="fixed inset-0 bg-gradient-to-b from-[#f8fafc] to-[#ecfdf5] -z-10" />

                {/* Floating Particles */}
                <div className="fixed inset-0 pointer-events-none -z-5 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 5}s`
                            }}
                        />
                    ))}
                </div>

                <section id="hero">
                    <Hero />
                </section>

                <section id="categories">
                    <CategoryTree />
                </section>

                <section id="recipes">
                    <RecipeStrip />
                </section>

                <section id="recommendations">
                    <Recommendations />
                </section>

                <AIAssistant />
            </div>
        </SmoothScroll>
    );
};

export default LandingPage;
