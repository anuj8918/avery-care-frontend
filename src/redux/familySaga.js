import { call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import {
    fetchFamilyMembersRequest,
    fetchFamilyMembersSuccess,
    fetchFamilyMembersFailure,
    addFamilyMemberRequest,
    addFamilyMemberSuccess,
    addFamilyMemberFailure,
    deleteFamilyMemberRequest,
    deleteFamilyMemberSuccess,
    deleteFamilyMemberFailure,
    updateFamilyMemberRequest,
    updateFamilyMemberSuccess,
    updateFamilyMemberFailure,
} from "./familySlice";
import { toast } from "react-toastify";

const selectAuthToken = (state) => state.auth.user?.token;
const API_BASE_URL = "https://avery-care-backend-3.onrender.com/api/family";

// Fetch
function* fetchFamilyMembersSaga(action) {
    try {
        const token = yield select(selectAuthToken);
        const { page = 1, limit = 5 } = action.payload || {}; // Default page/limit

        const config = {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, limit },
        };

        const res = yield call(() =>
            axios.get(`${API_BASE_URL}/fetchFamilyMembers`, config)
        );

        // FIX: Ensure the payload directly matches the reducer's expectation
        // The backend response format is already { data: [], meta: {} }
        const payload = {
            data: res.data?.data || [], // Access the 'data' property from the response
            meta: res.data?.meta || { total: 0, page: page, limit: limit, remaining: 0, hasNextPage: false }, // Access 'meta' and provide defaults
        };

        yield put(fetchFamilyMembersSuccess(payload));
    } catch (err) {
        const msg =
            err?.response?.data?.message || err.message || "Failed to fetch members";
        yield put(fetchFamilyMembersFailure(msg));
        toast.error(msg);
    }
}

// Add
function* addFamilyMemberSaga(action) {
    try {
        const token = yield select(selectAuthToken);
        const res = yield call(() =>
            axios.post(API_BASE_URL, action.payload, {
                headers: { Authorization: `Bearer ${token}` },
            })
        );
        yield put(addFamilyMemberSuccess());
        // Re-fetch family members from page 1 to ensure the new member appears
        // and pagination is reset correctly if needed.
        yield put(fetchFamilyMembersRequest({ page: 1, limit: 5 })); // Adjust limit if needed
        toast.success(res.data?.message || "Family member added successfully!");
    } catch (err) {
        const msg =
            err?.response?.data?.message || err.message || "Failed to add family member";
        yield put(addFamilyMemberFailure(msg));
        toast.error(msg);
    }
}

// Delete
function* deleteFamilyMemberSaga(action) {
    try {
        const token = yield select(selectAuthToken);
        const res = yield call(() =>
            axios.delete(`${API_BASE_URL}/${action.payload}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
        );
        yield put(deleteFamilyMemberSuccess());
        // Re-fetch family members after deletion
        yield put(fetchFamilyMembersRequest({ page: 1, limit: 5 })); // Adjust limit if needed
        toast.success(res.data?.message || "Family member deleted successfully!");
    } catch (err) {
        const msg =
            err?.response?.data?.message || err.message || "Failed to delete family member";
        yield put(deleteFamilyMemberFailure(msg));
        toast.error(msg);
    }
}

// Update
function* updateFamilyMemberSaga(action) {
    try {
        const token = yield select(selectAuthToken);
        const { id, updatedData } = action.payload;

        const res = yield call(() =>
            axios.put(`${API_BASE_URL}/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            })
        );

        // Ensure the payload passed to success action is the actual updated member data
        // The backend `updateFamilyMember` now returns { message: '...', familyMember: { ... } }
        yield put(updateFamilyMemberSuccess(res.data?.familyMember));
        toast.success(res.data?.message || "Family member updated successfully!");
    } catch (err) {
        const msg =
            err?.response?.data?.message || err.message || "Failed to update family member";
        yield put(updateFamilyMemberFailure(msg));
        toast.error(msg);
    }
}

export default function* familySaga() {
    yield takeLatest(fetchFamilyMembersRequest.type, fetchFamilyMembersSaga);
    yield takeLatest(addFamilyMemberRequest.type, addFamilyMemberSaga);
    yield takeLatest(deleteFamilyMemberRequest.type, deleteFamilyMemberSaga);
    yield takeLatest(updateFamilyMemberRequest.type, updateFamilyMemberSaga);
}