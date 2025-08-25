import { call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import { toast } from "react-toastify";
import {
  scheduleHealthCallRequest,
  scheduleHealthCallSuccess,
  scheduleHealthCallFailure,
  fetchScheduledCallsRequest,
  fetchScheduledCallsSuccess,
  fetchScheduledCallsFailure,
  updateScheduledCallRequest,
  updateScheduledCallSuccess,
  updateScheduledCallFailure,
  deleteScheduledCallRequest,
  deleteScheduledCallSuccess,
  deleteScheduledCallFailure,
} from "./callSlice";

const API_BASE_URL = "https://avery-care-backend-3.onrender.com/api/calls";

function* getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    const msg = "No authentication token found. Please log in.";
    toast.error(msg);
    yield put(scheduleHealthCallFailure(msg));
    return null;
  }
  return token;
}

function* scheduleHealthCallSaga(action) {
  try {
    const token = yield call(getAuthToken);
    if (!token) return;

    const { data } = yield call(
      axios.post,
      `${API_BASE_URL}/scheduleCall`,
      action.payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    yield put(scheduleHealthCallSuccess(data));

    toast.success(data.message || "Call scheduled successfully ✅");

    const { page, limit } = yield select((state) => state.call.scheduledCalls);
    const currentMemberId = yield select((state) => state.family.selectedFamilyMember?._id);
    if (currentMemberId) {
      yield put(fetchScheduledCallsRequest({ page, limit, scheduledToId: currentMemberId }));
    } else {
      yield put(fetchScheduledCallsRequest({ page, limit, status: 'pending' }));
    }

  } catch (error) {
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Failed to schedule call.";
    toast.error(msg);
    yield put(scheduleHealthCallFailure(msg));
  }
}

function* fetchScheduledCallsSaga(action) {
  try {
    const token = yield call(getAuthToken);
    if (!token) return;

    // --- CRITICAL: Ensure 'scheduledAt' is destructured here ---
    const { page, limit, status, recipientName, dateKeyword, scheduledToId, scheduledAt } = action.payload;

    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    if (status) queryParams.append("status", status);
    if (recipientName) queryParams.append("recipientName", recipientName);
    if (dateKeyword) queryParams.append("dateKeyword", dateKeyword);
    if (scheduledToId) queryParams.append("scheduledToId", scheduledToId);
    // --- CRITICAL: Ensure 'scheduledAt' is appended to queryParams ---
    if (scheduledAt) queryParams.append("scheduledAt", scheduledAt);

    const { data } = yield call(
      axios.get,
      `${API_BASE_URL}/getScheduledCalls?${queryParams.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    yield put(fetchScheduledCallsSuccess(data));
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    toast.error(msg);
    yield put(fetchScheduledCallsFailure(msg));
  }
}

function* updateScheduledCallSaga(action) {
  try {
    const token = yield call(getAuthToken);
    if (!token) return;

    const { id, scheduledAt } = action.payload;

    const { data } = yield call(
      axios.put,
      `${API_BASE_URL}/update-call/${id}`,
      { scheduledAt },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    yield put(updateScheduledCallSuccess(data));
    toast.success(data.message || "Call updated successfully ✅");

    const { page, limit } = yield select((state) => state.call.scheduledCalls);
    const currentMemberId = yield select((state) => state.family.selectedFamilyMember?._id);
    if (currentMemberId) {
      yield put(fetchScheduledCallsRequest({ page, limit, scheduledToId: currentMemberId }));
    } else {
      yield put(fetchScheduledCallsRequest({ page, limit, status: 'pending' }));
    }

  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    toast.error(msg);
    yield put(updateScheduledCallFailure(msg));
  }
}

function* deleteScheduledCallSaga(action) {
  try {
    const token = yield call(getAuthToken);
    if (!token) return;

    const { callId, scheduledToId } = action.payload;

    const { data } = yield call(
      axios.delete,
      `${API_BASE_URL}/delete-call/${callId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    yield put(deleteScheduledCallSuccess(data));

    toast.success(data.message || "Call deleted successfully 🗑️");

    const { page, limit } = yield select((state) => state.call.scheduledCalls);

    if (scheduledToId) {
      yield put(fetchScheduledCallsRequest({ page, limit, scheduledToId }));
    } else {
      yield put(fetchScheduledCallsRequest({ page, limit, status: 'pending' }));
    }

  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    toast.error(msg);
    yield put(deleteScheduledCallFailure(msg));
  }
}

function* watchCallSagas() {
  yield takeLatest(scheduleHealthCallRequest.type, scheduleHealthCallSaga);
  yield takeLatest(fetchScheduledCallsRequest.type, fetchScheduledCallsSaga);
  yield takeLatest(updateScheduledCallRequest.type, updateScheduledCallSaga);
  yield takeLatest(deleteScheduledCallRequest.type, deleteScheduledCallSaga);
}

export { watchCallSagas };