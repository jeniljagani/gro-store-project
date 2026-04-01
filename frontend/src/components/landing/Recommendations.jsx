import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ProductCard from '../product/ProductCard';

const Recommendations = () => {
    const [products, setProducts] = useState([]);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchRecs = async () => {
            try {
                // In a real app we'd call a special endpoint, but for now we get trending items
                const { data } = await axios.get('/api/products');
                setProducts(data.products.slice(0, 4));
            } catch (error) {
                console.error(error);
            }
        };
        fetchRecs();
    }, []);

    return (
        <div className="py-40 bg-[#ecfdf5]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black text-slate-900 mb-6"
                    >
                        Recommended for <span className="text-primary">{user ? user.name : 'You'}</span>
                    </motion.h2>
                    <p className="text-xl text-slate-500 font-medium tracking-wide">Handpicked selection based on your exquisite taste.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {products.map((product, i) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Recommendations;
