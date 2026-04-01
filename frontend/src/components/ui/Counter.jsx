import React, { useEffect } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

const Digit = ({ value, fontSize, gap }) => {
    const spring = useSpring(0, { stiffness: 50, damping: 15 });
    const displayValue = useTransform(spring, (latest) => Math.round(latest) % 10);

    // Create a column of numbers 0-9 for the vertical scroll effect
    const y = useTransform(spring, (latest) => -(latest % 10) * fontSize);

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return (
        <div
            className="relative overflow-hidden flex items-center justify-center"
            style={{ height: fontSize, width: fontSize * 0.6 }}
        >
            <motion.div
                style={{ y }}
                className="absolute top-0 flex flex-col"
            >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <span
                        key={num}
                        className="flex items-center justify-center"
                        style={{ height: fontSize, fontSize }}
                    >
                        {num}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

const Counter = ({
    value = 0,
    places = [100, 10, 1],
    fontSize = 80,
    padding = 5,
    gap = 10,
    textColor = "white",
    fontWeight = 900
}) => {
    // Convert value to array of digits based on places
    const digits = places.map((place) => Math.floor((value / place) % 10));

    return (
        <div
            className="flex items-center justify-center rounded-3xl"
            style={{
                padding: `${padding}px`,
                gap: `${gap}px`,
                color: textColor,
                fontWeight: fontWeight
            }}
        >
            {digits.map((digit, index) => (
                <Digit
                    key={index}
                    value={digit}
                    fontSize={fontSize}
                    gap={gap}
                />
            ))}
        </div>
    );
};

export default Counter;
