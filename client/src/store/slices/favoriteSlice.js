import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: []
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.favorites.find(item => item._id === action.payload._id)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(item => item._id !== action.payload);
    }
  }
});

export const { addToFavorites, removeFromFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer; 