import { createSlice } from '@reduxjs/toolkit';

let cartItems = [];
try {
    const savedCart = localStorage.getItem('cartItems');
    cartItems = savedCart ? JSON.parse(savedCart) : [];
} catch (error) {
    console.error('Error parsing cartItems from localStorage:', error);
    localStorage.removeItem('cartItems');
}

const initialState = {
    cartItems: cartItems,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? {
                        ...x,
                        qty: x.qty + (item.qty || 1),
                    } : x
                );
            } else {
                state.cartItems.push({
                    ...item,
                    qty: item.qty || 1,
                    // Ensure metadata exists for UI fallback
                    quantity: item.quantity || 1,
                    unit: item.unit || 'pcs',
                });
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        updateQuantity: (state, action) => {
            const { id, qty } = action.payload;
            state.cartItems = state.cartItems.map((x) =>
                x._id === id ? { ...x, qty: Math.max(1, qty) } : x
            );
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
