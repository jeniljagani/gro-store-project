import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch favorites from server (returns populated product objects)
export const fetchFavorites = createAsyncThunk('favorites/fetchFavorites', async (_, thunkAPI) => {
    try {
        const { auth } = thunkAPI.getState();
        if (!auth.user?.token) return [];
        const config = { headers: { Authorization: `Bearer ${auth.user.token}` } };
        const { data } = await axios.get('/api/favorites', config);
        return data; // array of product objects
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Toggle favorite (add or remove)
export const toggleFavorite = createAsyncThunk('favorites/toggleFavorite', async (productId, thunkAPI) => {
    try {
        const { auth } = thunkAPI.getState();
        if (!auth.user?.token) return thunkAPI.rejectWithValue('Not logged in');
        const config = { headers: { Authorization: `Bearer ${auth.user.token}` } };
        const { data } = await axios.post(`/api/favorites/${productId}`, {}, config);
        return { productId, favorites: data.favorites }; // server returns updated favorites array (IDs)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        items: [],        // populated product objects
        favoriteIds: [],   // just product IDs for quick lookup
        isLoading: false,
        error: null,
    },
    reducers: {
        clearFavorites: (state) => {
            state.items = [];
            state.favoriteIds = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => { state.isLoading = true; })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
                state.favoriteIds = action.payload.map(p => p._id);
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Optimistic toggle
            .addCase(toggleFavorite.pending, (state, action) => {
                const productId = action.meta.arg;
                if (state.favoriteIds.includes(productId)) {
                    state.favoriteIds = state.favoriteIds.filter(id => id !== productId);
                    state.items = state.items.filter(p => p._id !== productId);
                } else {
                    state.favoriteIds.push(productId);
                }
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                // Server confirms — sync the ID list
                state.favoriteIds = action.payload.favorites;
            })
            .addCase(toggleFavorite.rejected, (state, action) => {
                // Revert on error — re-fetch is safest
                state.error = action.payload;
            });
    },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
