import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/api";
import { showLoader, hideLoader } from "./loaderSlice";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showLoader({ message: "Fetching products..." }));
      const res = await API.get("/products");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load products");
    } finally {
      dispatch(hideLoader());
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateStock: (state, action) => {
      const { _id, stock } = action.payload;
      const product = state.items.find((p) => p._id === _id);
      if (product) product.stock = stock;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateStock } = productsSlice.actions;
export default productsSlice.reducer;
