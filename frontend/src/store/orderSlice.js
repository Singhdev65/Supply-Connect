import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/api";

export const placeOrder = createAsyncThunk(
  "order/place",
  async (items, { rejectWithValue }) => {
    try {
      const res = await API.post("/orders", {
        items: items.map((i) => ({
          product: i._id,
          qty: i.qty,
        })),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const fetchOrders = createAsyncThunk(
  "order/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/orders");
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to load orders");
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null,
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
