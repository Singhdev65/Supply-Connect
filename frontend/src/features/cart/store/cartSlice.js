import { createSlice } from "@reduxjs/toolkit";
import {
  loadCartFromStorage,
  saveCartToStorage,
  clearCartStorage,
} from "../../../utils/cartStorage";

const initialState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      const existing = state.items.find((item) => item._id === product._id);

      if (!existing) {
        state.items.push({ ...product, qty: 1 });
      } else if (existing.qty < product.stock) {
        existing.qty += 1;
      }

      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      const product = action.payload;

      const existing = state.items.find((item) => item._id === product._id);

      if (!existing) return;

      if (existing.qty === 1) {
        state.items = state.items.filter((item) => item._id !== product._id);
      } else {
        existing.qty -= 1;
      }

      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      clearCartStorage();
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
