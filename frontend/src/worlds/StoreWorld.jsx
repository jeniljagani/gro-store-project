import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, Text, MeshDistortMaterial, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Bloom, EffectComposer, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlassPortal } from './Shared';
import { ShoppingCart, Plus as PlusIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/product/ProductCard';

const ProductPlatform = ({ product, position, delay, onAdd }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const dispatch = useDispatch();

    const handleQuickAdd = (e) => {
        e.stopPropagation();
        dispatch(addToCart({ ...product, qty: 1 }));
        toast.success(`${product.name} Added`);
    };

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.position.y = position[1] + Math.sin(t + delay) * 0.1;
        meshRef.current.rotation.y += 0.005;

        const targetScale = hovered ? 1.2 : 1;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return (
        <group position={position}>
            {/* High-End Glass Platform */}
            <mesh
                ref={meshRef}
                castShadow
                receiveShadow
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <cylinderGeometry args={[1, 1.2, 0.15, 24]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transmission={0.9}
                    thickness={1}
                    roughness={0}
                    metalness={0.1}
                    ior={1.5}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    envMapIntensity={2}
                />
            </mesh>

            {/* Glowing Ring Base */}
            <mesh position={[0, -0.1, 0]}>
                <ringGeometry args={[0.9, 1.1, 24]} />
                <meshStandardMaterial
                    color="#22c55e"
                    emissive="#22c55e"
                    emissiveIntensity={hovered ? 5 : 1}
                    transparent
                    opacity={0.5}
                />
            </mesh>

            <Text
                position={[0, 0.8, 0]}
                fontSize={0.2}
                color="white"
                font="https://fonts.gstatic.com/s/outfit/v11/Q8iXmI6waS2Iz_46r79v5nS8.woff"
                maxWidth={1.5}
                textAlign="center"
                anchorY="bottom"
            >
                {product.name.toUpperCase()}
            </Text>

            {/* Quick Add Visual indicator */}
            <mesh position={[0, 0, 0]} onClick={handleQuickAdd} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
                <sphereGeometry args={[1.2, 16, 16]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </group>
    );
};


const StoreWorld = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('Fresh Vegetables');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const categories = [
        'Fresh Vegetables', 'Fruits', 'Dairy', 'Snacks', 'Beverages', 'Personal Care'
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/products?category=${category}`);
                setProducts(data.products.slice(0, 6)); // Show top 6 in 3D
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]);

    return (
        <div className="h-screen relative overflow-hidden bg-white">
            {/* 3D Environment */}
            <div className="absolute inset-0 z-0">
                <Canvas shadows dpr={[1, 2]} eventSource={document.getElementById('root')} eventPrefix="client">
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Environment preset="apartment" />

                    <Suspense fallback={null}>
                        {products.map((p, i) => {
                            const x = (i % 3 - 1) * 3.5;
                            const z = Math.floor(i / 3) * -4;
                            return (
                                <ProductPlatform
                                    key={p._id}
                                    product={p}
                                    position={[x, -1.5, z]}
                                    delay={i * 0.5}
                                />
                            );
                        })}
                    </Suspense>

                    <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.25} far={10} color="#000000" />
                    <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 4} />

                    <EffectComposer disableNormalPass>
                        <Bloom luminanceThreshold={1} intensity={0.5} levels={6} mipmapBlur />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                        <Noise opacity={0.01} />
                    </EffectComposer>
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className="relative z-10 w-full h-full flex flex-col pointer-events-none">
                {/* Rolling Category Search */}
                <div className="p-12 flex justify-center pointer-events-auto">
                    <div className="flex gap-4 p-2 bg-slate-100 rounded-[2.5rem] shadow-inner overflow-x-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all ${category === cat
                                    ? 'bg-slate-900 text-white shadow-xl scale-105'
                                    : 'bg-transparent text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Vertical Scroll Hint */}
                <div className="mt-auto p-12 flex justify-between items-end">
                    <div className="max-w-xl">
                        <motion.h2
                            key={category}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-7xl font-black text-slate-900 leading-tight mb-4"
                        >
                            {category.split(' ')[0]}<br />
                            <span className="text-primary">{category.split(' ')[1] || ''}</span>
                        </motion.h2>
                        <p className="text-lg text-slate-500 font-medium">Explore the finest selection of organic {category.toLowerCase()} curated for your health.</p>
                    </div>

                    <div className="pointer-events-auto">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/shop')}
                            data-cursor="View Grid"
                            className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl"
                        >
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreWorld;
