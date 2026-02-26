import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductsApi } from "@/features/products/api";
import { showLoader, hideLoader } from "@/store/loaderSlice";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue, dispatch }) => {
    const { append = false, ...queryParams } = params;
    try {
      if (!append) {
        dispatch(showLoader({ message: "Fetching products..." }));
      }
      const data = await fetchProductsApi(queryParams);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load products");
    } finally {
      if (!append) {
        dispatch(hideLoader());
      }
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    meta: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasMore: true,
    },
    loading: false,
    loadingMore: false,
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
      .addCase(fetchProducts.pending, (state, action) => {
        const append = Boolean(action.meta.arg?.append);
        if (append) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const append = Boolean(action.meta.arg?.append);
        const payload = action.payload;
        const payloadData = payload?.data ?? payload;
        const isPaginatedPayload =
          payloadData &&
          typeof payloadData === "object" &&
          Array.isArray(payloadData.data) &&
          payloadData.meta;

        const nextItems = isPaginatedPayload
          ? payloadData.data
          : Array.isArray(payloadData)
            ? payloadData
            : [];
        const nextMeta = isPaginatedPayload
          ? payloadData.meta
          : {
              page: 1,
              limit: nextItems.length || 20,
              total: nextItems.length || 0,
              totalPages: 1,
              hasMore: false,
            };

        state.loading = false;
        state.loadingMore = false;
        if (append) {
          const existingIds = new Set(state.items.map((item) => item._id));
          const merged = [...state.items];
          nextItems?.forEach((item) => {
            if (!existingIds.has(item._id)) merged.push(item);
          });
          state.items = merged;
        } else {
          state.items = nextItems;
        }
        state.meta = nextMeta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload;
      });
  },
});

export const { updateStock } = productsSlice.actions;
export default productsSlice.reducer;
