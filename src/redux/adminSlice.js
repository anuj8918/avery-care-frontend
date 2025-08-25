import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  token: "",
  loading: false,
  error: null,
  isAuthenticated: false,
  step: 1, // 1: login, 2: OTP verification
};

const adminSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    // --------------------
    // Step 1: Admin enters email + password
    // --------------------
    adminLoginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    adminLoginSuccess(state, action) {
      state.loading = false;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("adminToken", action.payload.token);
      localStorage.setItem("adminEmail", action.payload.email);
    },
    adminLoginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

   
    // --------------------
    // Step 3: Logout
    // --------------------
    // adminLogout(state) {
    //   state.email = "";
    //   state.token = "";
    //   state.isAuthenticated = false;
    //   state.step = 1; // Reset to login step
    //   localStorage.removeItem("adminToken");
    // },

    // Optional: Clear errors
    clearError(state) {
      state.error = null;
    },

    
  },
});

export const {
  adminLoginRequest,
  adminLoginSuccess,
  adminLoginFailure,
  clearError,
} = adminSlice.actions;

export default adminSlice.reducer;
