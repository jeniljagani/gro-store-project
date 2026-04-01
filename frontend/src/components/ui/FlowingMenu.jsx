import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const FlowingMenu = ({
    items = [],
    speed = 1,
    textColor = "#ffffff",
    bgColor = "#060010",
    marqueeBgColor = "#ffffff",
    marqueeTextColor = "#060010",
    borderColor = "rgba(255,255,255,0.1)"
}) => {
    return (
        <div className="w-full flex flex-col" style={{ backgroundColor: bgColor }}>
            {items.map((item, index) => (
                <MenuItem
                    key={index}
                    item={item}
                    speed={speed}
                    textColor={textColor}
                    marqueeBgColor={marqueeBgColor}
                    marqueeTextColor={marqueeTextColor}
                    borderColor={borderColor}
                />
            ))}
        </div>
    );
};

const MenuItem = ({ item, speed, textColor, marqueeBgColor, marqueeTextColor, borderColor }) => {
    const marqueeRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!marqueeRef.current) return;

        const marquee = marqueeRef.current;
        const totalWidth = marquee.scrollWidth / 2;

        const animation = gsap.to(marquee, {
            x: -totalWidth,
            duration: 25 / speed, // Cinematic slow speed
            ease: "none",
            repeat: -1,
        });

        if (!isHovered) {
            animation.pause();
        } else {
            animation.play();
        }

        return () => animation.kill();
    }, [isHovered, speed]);

    return (
        <div
            className="group relative w-full h-14 md:h-16 flex items-center justify-center overflow-hidden cursor-default"
            style={{ borderColor: borderColor }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
        >
            {/* Default Text */}
            <span
                className={`text-xl md:text-3xl font-medium uppercase tracking-widest transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                style={{ color: textColor }}
            >
                {item.text}
            </span>

            {/* Hover Marquee */}
            <div
                className={`absolute inset-0 flex items-center transition-transform duration-500 translate-y-full group-hover:translate-y-0`}
                style={{ backgroundColor: marqueeBgColor }}
            >
                <div ref={marqueeRef} className="flex whitespace-nowrap items-center">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-6 px-6">
                            <span
                                className="text-xl md:text-3xl font-bold uppercase tracking-tight"
                                style={{ color: marqueeTextColor }}
                            >
                                {item.text}
                            </span>
                            <div className="w-24 h-10 md:w-32 md:h-12 rounded-full overflow-hidden border border-slate-900/10 shadow-sm">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FlowingMenu;
