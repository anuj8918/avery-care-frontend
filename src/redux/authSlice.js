import { createSlice } from "@reduxjs/toolkit";

let userFromStorage = null;
try {
  const storedUser = localStorage.getItem("user");
  userFromStorage = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
} catch (err) {
  console.error("Failed to parse user from localStorage:", err);
}

const initialState = {
  user: userFromStorage,
  loading: false,
  error: null,
  successMessage: null,
  email: null,
  verified: !!userFromStorage,
  isAuthenticated: !!userFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔹 Login
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // ✅ Change: Reducer ab direct payload (user object) expect kar raha hai
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload; // .user hata diya
      state.isAuthenticated = true;
      console.log(state.isAuthenticated)
      const token = action.payload?.token; // .user hata diya
      localStorage.setItem("user", JSON.stringify(action.payload)); // .user hata diya

      if (token) {
        console.log("token mil gya")
        localStorage.setItem("token", token)}
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Signup
    signupRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.successMessage = "Signup successful! Please verify OTP.";
      state.email = action.payload.email;
    },
    signupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Verify OTP
    verifyOtpRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // ✅ Change: Reducer ab direct payload (user object) expect kar raha hai
    verifyOtpSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload; // .user hata diya
      state.verified = true;
      state.successMessage = "OTP Verified successfully. Please login now.";
      localStorage.setItem("user", JSON.stringify(action.payload)); // .user hata diya
    },
    verifyOtpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.email = null;
      state.verified = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  verifyOtpRequest,
  verifyOtpSuccess,
  verifyOtpFailure,
  logout,
  clearError,
  clearSuccessMessage,
} = authSlice.actions;

export default authSlice.reducer;