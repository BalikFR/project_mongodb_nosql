import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  totalQuantity: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.totalQuantity = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;

export default cartSlice.reducer; 