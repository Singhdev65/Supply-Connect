import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import productsReducer from "./productsSlice";
import orderReducer from "./orderSlice";
import loaderReducer from "./loaderSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    order: orderReducer,
    loader: loaderReducer,
  },
});

export default store;
