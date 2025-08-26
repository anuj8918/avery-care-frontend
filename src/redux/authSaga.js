import { call, put, takeLatest } from "redux-saga/effects";
import {
  loginRequest, loginSuccess, loginFailure,
  signupRequest, signupSuccess, signupFailure,
  verifyOtpRequest, verifyOtpSuccess, verifyOtpFailure,
} from "./authSlice";
import toast from "react-hot-toast";

const API_BASE_URL = "https://avery-care-backend-3.onrender.com/api/auth";

// 🔹 Signup Worker
function* signupWorker(action) {
  try {
    const response = yield call(() =>
      fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action.payload),
      }).then(res => res.json())
    );

    if (response.success) {
      yield put(signupSuccess({ email: action.payload.email }));
      toast.success(response.message || "Signup successful! Please verify OTP");
    } else {
      yield put(signupFailure(response.message || "Signup failed."));
      toast.error(response.message || "Signup failed ❌");
    }
  } catch (error) {
    yield put(signupFailure(error.message || "Network error during signup."));
    toast.error(error.message || "Signup error ❌");
  }
}

// 🔹 Login Worker
function* loginWorker(action) {
  try {
    const response = yield call(() =>
      fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action.payload),
      }).then(res => res.json())
    );

    if (response.success) {
      // ✅ Change: API response ko seedha bheja gaya hai
      console.log("response success")
      yield put(loginSuccess(response));
      toast.success(response.message || "Login successful ");
    } else {
      console.log("response failed")
      yield put(loginFailure(response.message || "Invalid credentials."));

      toast.error(response.message || "Login failed ❌");
    }
  } catch (error) {
    yield put(loginFailure(error.message || "Network error during login."));
    toast.error(error.message || "Login error ❌");
  }
}

// 🔹 OTP Verify Worker
function* verifyOtpWorker(action) {
  try {
    const response = yield call(() =>
      fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action.payload),
      }).then(res => res.json())
    );

    if (response.success) {
      // ✅ Change: API response ko seedha bheja gaya hai (consistency ke liye)
      yield put(verifyOtpSuccess(response));
      toast.success(response.message || "OTP verified 🎉");
    } else {
      yield put(verifyOtpFailure(response.message || "OTP verification failed."));
      toast.error(response.message || "OTP verification failed ❌");
    }
  } catch (error) {
    yield put(verifyOtpFailure(error.message || "Network error during OTP."));
    toast.error(error.message || "OTP error ❌");
  }
}

// 🔹 Watcher Saga
export default function* authSaga() {
  yield takeLatest(signupRequest.type, signupWorker);
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(verifyOtpRequest.type, verifyOtpWorker);
}