import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    active: false,
    message: "Loading...",
  },
  reducers: {
    showLoader: (state, action) => {
      state.active = true;
      if (action.payload?.message) state.message = action.payload.message;
    },
    hideLoader: (state) => {
      state.active = false;
      state.message = "Loading...";
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
