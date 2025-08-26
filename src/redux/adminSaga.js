// // src/redux/adminSaga.js

// import { call, put, takeLatest } from "redux-saga/effects";
// import axios from "axios";
// import { setAdminToken } from "../utils/adminAuth";  // ✅ localStorage helper import

// import {
//   adminLoginRequest,
//   adminLoginSuccess,
//   adminLoginFailure,
// } from "./adminSlice";

// // --------------------
// // Admin Login Saga
// // --------------------
// function* loginAdminSaga(action) {
//   try {
//     const { email, password } = action.payload;

//     // API call
//     const res = yield call(
//       axios.post,
//       "https://avery-care-backend-3.onrender.com/api/auth/login",
//       { email, password }
//     );

//     const { token } = res.data;

//     if (token) {
//       // ✅ Save token to localStorage
//       setAdminToken(token);
//       localStorage.setItem("adminEmail", email);

//       // ✅ Dispatch success
//       yield put(adminLoginSuccess({ token, email }));
//     } else {
//       yield put(adminLoginFailure("Invalid login response"));
//     }
//   } catch (error) {
//     yield put(
//       adminLoginFailure(error.response?.data?.message || "Login failed")
//     );
//   }
// }

// // --------------------
// // Root Admin Saga
// // --------------------
// export default function* adminSaga() {
//   yield takeLatest(adminLoginRequest.type, loginAdminSaga);
// }


// src/redux/adminSaga.js

import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { setAdminToken } from "../utils/adminAuth";
import toast from 'react-hot-toast'; // ✅ Step 1: Import toast

import {
  adminLoginRequest,
  adminLoginSuccess,
  adminLoginFailure,
} from "./adminSlice";

// --------------------
// Admin Login Saga
// --------------------
function* loginAdminSaga(action) {
  try {
    const { email, password } = action.payload;

    // API call
    const res = yield call(
      axios.post,
      "https://avery-care-backend-3.onrender.com/api/auth/login",
      { email, password }
    );

    const { data } = res; // Using res.data for clarity

    // We expect the token and user data in the response
    if (data.success && data.token) {
      // ✅ Save token to localStorage
      setAdminToken(data.token);
      localStorage.setItem("adminEmail", email);

      // ✅ Dispatch success
      yield put(adminLoginSuccess({ token: data.token, email }));

      // ✅ Step 2: Show success toast
      toast.success(data.message || "Admin login successful!");

    } else {
      // Handle cases where API returns success: false or no token
      const failureMessage = data.message || "Invalid login response";
      yield put(adminLoginFailure(failureMessage));
      
      // ✅ Step 3: Show error toast
      toast.error(failureMessage);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
    
    yield put(adminLoginFailure(errorMessage));

    // ✅ Step 3: Show error toast on network/server error
    toast.error(errorMessage);
  }
}

// --------------------
// Root Admin Saga
// --------------------
export default function* adminSaga() {
  yield takeLatest(adminLoginRequest.type, loginAdminSaga);
}