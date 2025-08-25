// src/redux/adminSaga.js

import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { setAdminToken } from "../utils/adminAuth";  // ✅ localStorage helper import

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

    const { token } = res.data;

    if (token) {
      // ✅ Save token to localStorage
      setAdminToken(token);
      localStorage.setItem("adminEmail", email);

      // ✅ Dispatch success
      yield put(adminLoginSuccess({ token, email }));
    } else {
      yield put(adminLoginFailure("Invalid login response"));
    }
  } catch (error) {
    yield put(
      adminLoginFailure(error.response?.data?.message || "Login failed")
    );
  }
}

// --------------------
// Root Admin Saga
// --------------------
export default function* adminSaga() {
  yield takeLatest(adminLoginRequest.type, loginAdminSaga);
}
