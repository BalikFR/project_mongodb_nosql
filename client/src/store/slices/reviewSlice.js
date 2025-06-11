import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/reviews/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/reviews/${productId}`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  reviews: [],
  loading: false,
  error: null
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erreur lors de la récupération des avis';
      })
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erreur lors de la création de l\'avis';
      });
  }
});

export default reviewSlice.reducer; 