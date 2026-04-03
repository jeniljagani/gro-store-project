import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

export const getWalletBalance = createAsyncThunk(
    'wallet/getBalance',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth: { user } } = getState();
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/wallet', config);
            return data.balance;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const addMoneyToWallet = createAsyncThunk(
    'wallet/addMoney',
    async (amount, { getState, rejectWithValue }) => {
        try {
            const { auth: { user } } = getState();
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('/api/wallet/add', { amount }, config);
            return data.balance;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getWalletTransactions = createAsyncThunk(
    'wallet/getTransactions',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth: { user } } = getState();
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/wallet/transactions', config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        balance: 0,
        transactions: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        resetWalletStatus: (state) => {
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWalletBalance.pending, (state) => {
                state.loading = true;
            })
            .addCase(getWalletBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload;
            })
            .addCase(getWalletBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addMoneyToWallet.pending, (state) => {
                state.loading = true;
            })
            .addCase(addMoneyToWallet.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload;
                state.success = true;
            })
            .addCase(addMoneyToWallet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getWalletTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getWalletTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(getWalletTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetWalletStatus } = walletSlice.actions;
export default walletSlice.reducer;
