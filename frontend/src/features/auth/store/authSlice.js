import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.user = {
        ...(user || {}),
        token,
      };
      state.loading = false;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user?.role || "");
      localStorage.setItem("id", user?.id || "");
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("id");
    },
    setUserProfile: (state, action) => {
      if (!state.user) return;
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUserProfile } =
  authSlice.actions;
export default authSlice.reducer;
