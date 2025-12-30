import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunk ---

// Process checkout and create an order
// checkoutSlice.js
  export const checkout = createAsyncThunk(
    'checkout/createCheckout',
    async (checkoutData, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('userToken');

        if (!token) {
          return rejectWithValue({
            message: 'No authentication token found. Please log in again.',
          });
        }

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
          checkoutData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure no extra spaces
            },
          }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Server Error');
      }
    }
  );



// --- Checkout Slice ---

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    checkout: null,
    loading: false,
    error: null,
  },
  reducers: {
    // resetCheckout: (state) => {
    //   state.loading = false;
    //   state.error = null;
    //   state.success = false;
    },
  
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutDetails = action.payload;
        state.success = true;
      })
      .addCase(checkout.rejected, (state, action) => {
  state.loading = false;
  // This helps you see if it's "Invalid shipping address", "no items", etc.
  state.error = action.payload?.message || "Something went wrong";
  state.success = false;
});
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
