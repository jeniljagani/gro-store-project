import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoritesSlice';
import walletReducer from './slices/walletSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        favorites: favoritesReducer,
        wallet: walletReducer
    },
});
