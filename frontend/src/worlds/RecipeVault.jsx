import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Text, PerspectiveCamera, OrbitControls, Stars, Float as FloatDrei, MeshWobbleMaterial } from '@react-three/drei';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Bloom, EffectComposer, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { WorldLayout, GlassPortal } from './Shared';

const RecipePlanet = ({ recipe, orbitRadius, speed, offset }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef();
    const meshRef = useRef();

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.getElapsedTime() * speed + offset;
        groupRef.current.position.x = Math.cos(t) * orbitRadius;
        groupRef.current.position.z = Math.sin(t) * orbitRadius;
        groupRef.current.position.y = Math.sin(t * 0.5) * 1;

        meshRef.current.rotation.y += 0.01;
        const targetScale = hovered ? 1.5 : 1;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return (
        <group ref={groupRef}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => navigate(`/recipes/${recipe._id}`)}
            >
                <sphereGeometry args={[0.5, 24, 24]} />
                <meshPhysicalMaterial
                    color={hovered ? "#fbbf24" : "#ffffff"}
                    emissive={hovered ? "#fbbf24" : "#000000"}
                    emissiveIntensity={hovered ? 2 : 0}
                    transmission={0.8}
                    thickness={2}
                    roughness={0}
                    metalness={0.5}
                    ior={1.4}
                />
                <pointLight intensity={0.5} color="#fbbf24" />
            </mesh>

            <Text
                position={[0, -0.8, 0]}
                fontSize={0.2}
                color="white"
                maxWidth={2}
                textAlign="center"
                opacity={hovered ? 1 : 0.4}
            >
                {recipe.name}
            </Text>
        </group>
    );
};

const RecipeVault = () => {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const { data } = await axios.get('/api/recipes');
                setRecipes(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRecipes();
    }, []);

    return (
        <div className="h-screen relative bg-slate-950 overflow-hidden">
            {/* 3D Environment */}
            <div className="absolute inset-0 z-0">
                <Canvas dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 10, 15]} fov={50} />
                    <ambientLight intensity={0.1} />
                    <pointLight position={[0, 0, 0]} intensity={2} color="#fbbf24" />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    {/* Central Core */}
                    <FloatDrei speed={2} rotationIntensity={1} floatIntensity={1}>
                        <mesh>
                            <sphereGeometry args={[1.5, 32, 32]} />
                            <meshStandardMaterial emissive="#fbbf24" emissiveIntensity={2} color="#fbbf24" />
                        </mesh>
                    </FloatDrei>

                    <Suspense fallback={null}>
                        {recipes.slice(0, 12).map((recipe, i) => (
                            <RecipePlanet
                                key={recipe._id}
                                recipe={recipe}
                                orbitRadius={5 + (i % 3) * 2}
                                speed={0.2 + (i * 0.05)}
                                offset={i * (Math.PI / 6)}
                            />
                        ))}
                    </Suspense>

                    <OrbitControls
                        enableZoom={false}
                        maxDistance={25}
                        minDistance={8}
                        autoRotate
                        autoRotateSpeed={0.2}
                    />

                    <EffectComposer disableNormalPass>
                        <Bloom luminanceThreshold={1} intensity={1} levels={6} mipmapBlur />
                        <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                        <Noise opacity={0.01} />
                    </EffectComposer>
                </Canvas>
            </div>

            {/* UI Controls */}
            <div className="absolute inset-0 z-10 p-12 flex flex-col pointer-events-none">
                <div className="max-w-4xl mx-auto w-full text-center mt-20">
                    <motion.h2
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-8xl font-black text-white mb-2 uppercase tracking-[1.5rem] ml-[1.5rem]"
                    >
                        Recipe<br />
                        <span className="text-secondary">Vault</span>
                    </motion.h2>
                    <p className="text-white/40 uppercase tracking-widest font-black text-xl mb-12">Navigate the curated flavors of India</p>

                    <div className="relative max-w-2xl mx-auto pointer-events-auto">
                        <input
                            type="text"
                            placeholder="Search the index of flavor..."
                            className="w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full px-12 py-6 text-white text-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-bold text-center"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-auto flex justify-between items-center w-full">
                    <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/5">
                        <p className="text-secondary font-black uppercase tracking-widest mb-1">Trending Selection</p>
                        <h4 className="text-3xl text-white font-black">Spicy Paneer Tikka</h4>
                    </div>

                    <div className="text-right">
                        <p className="text-white/30 uppercase font-black tracking-widest mb-2">Vault Stats</p>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-white text-2xl font-black">{recipes.length}</p>
                                <p className="text-white/40 text-xs font-bold uppercase">Recipes</p>
                            </div>
                            <div>
                                <p className="text-white text-2xl font-black">1.2K</p>
                                <p className="text-white/40 text-xs font-bold uppercase">Cooks</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeVault;
