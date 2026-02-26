import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { cartReducer } from "@/features/cart";
import authReducer from "@/features/auth/store/authSlice";
import productsReducer from "@/features/products/store/productsSlice";
import orderReducer from "@/features/orders/store/orderSlice";
import { featureFlags } from "@/app/config/featureFlags";
import loaderReducer from "./loaderSlice";

const reducers = {
  auth: authReducer,
  loader: loaderReducer,
};

if (featureFlags.cart) {
  reducers.cart = cartReducer;
}

if (featureFlags.products) {
  reducers.products = productsReducer;
}

if (featureFlags.orders) {
  reducers.order = orderReducer;
}

const persistConfig = {
  key: "root",
  storage,
  whitelist: Object.keys(reducers).filter((key) =>
    ["auth", "cart", "order"].includes(key),
  ),
};

const rootReducer = combineReducers(reducers);
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
