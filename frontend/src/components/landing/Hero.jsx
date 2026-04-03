import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FloatingItem = ({ position, color, label }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.2;
        meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
        meshRef.current.rotation.z = Math.cos(t * 0.3) * 0.1;
    });

    return (
        <mesh ref={meshRef} position={position} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <MeshDistortMaterial color={color} speed={2} distort={0.3} radius={0.5} />
            <Text
                position={[0, 0, 0.4]}
                fontSize={0.1}
                color="black"
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </mesh>
    );
};

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Canvas dpr={[1, 1.5]} eventSource={document.getElementById('root')} eventPrefix="client">
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
                    <pointLight position={[-10, -10, -10]} />

                    <Suspense fallback={null}>
                        <FloatingItem position={[-2, 1, 0]} color="#ef4444" label="Apple" />
                        <FloatingItem position={[2, 1.5, -1]} color="#3b82f6" label="Milk" />
                        <FloatingItem position={[-2.5, -1.2, 1]} color="#facc15" label="Banana" />
                        <FloatingItem position={[2.2, -1, 0]} color="#f97316" label="Orange" />
                        <FloatingItem position={[0, 2, -2]} color="#22c55e" label="Green" />
                    </Suspense>
                </Canvas>
            </div>

            <div className="relative z-10 text-center space-y-8 px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="text-[12vw] font-black text-slate-900 leading-[0.8] tracking-tighter"
                >
                    Groceries,<br />
                    <span className="text-primary">Reimagined</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-xl md:text-2xl text-slate-500 font-medium max-w-lg mx-auto"
                >
                    Experience food shopping like never before. Pure quality, delivered with magic.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col md:flex-row gap-6"
                >
                    <button
                        onClick={() => navigate('/shop')}
                        data-cursor="Explore"
                        className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 transition-transform"
                    >
                        Shop Now
                    </button>
                    <button
                        data-cursor="View"
                        className="px-12 py-6 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-black text-xl shadow-lg hover:scale-105 transition-transform"
                    >
                        Watch Experience
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
