

// ✨ CHANGE 1: Import 'select' and 'toast'
import { call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import toast from 'react-hot-toast'; // Import toast for notifications

import {
    fetchUsersRequest,
    fetchUsersSuccess,
    fetchUsersFailure,
    fetchUserDetailRequest,
    fetchUserDetailSuccess,
    fetchUserDetailFailure,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFailure,
    fetchFamilyMembersRequest,
    fetchFamilyMembersSuccess,
    fetchFamilyMembersFailure,
    fetchSingleFamilyMemberRequest,
    fetchSingleFamilyMemberSuccess,
    fetchSingleFamilyMemberFailure,
    deleteFamilyMemberRequest,
    deleteFamilyMemberSuccess,
    deleteFamilyMemberFailure,
    fetchScheduledCallsRequest,
    fetchScheduledCallsSuccess,
    fetchScheduledCallsFailure,
    deleteScheduledCallRequest,
    deleteScheduledCallSuccess,
    deleteScheduledCallFailure,
} from "./userSlice";
import { getAdminToken } from "../utils/adminAuth";

// ✨ CHANGE 2: Define a common base URL for the admin API
const API_BASE_URL = "https://avery-care-backend-3.onrender.com/api/admin";

function* fetchUsersSaga(action) {
    try {
        const token = getAdminToken();
        if (!token) throw new Error("No authorization token found");
        const { page = 1, limit = 10, filters = {} } = action.payload || {};
        
        // --- This complex filter logic remains the same ---
        const queryParams = new URLSearchParams({ page, limit });
        if (filters.search && filters.search.trim() !== "") {
            if (filters.searchType === "name") {
                queryParams.append("name", filters.search.trim());
            } else if (filters.searchType === "email") {
                queryParams.append("email", filters.search.trim());
            } else if (filters.searchType === "phoneNumber") {
                queryParams.append("phoneNumber", filters.search.trim());
            }
        }
        if (filters.isVerified) {
            queryParams.append("isVerified", filters.isVerified);
        }
        if (filters.createdAtInBetweenStartDate) {
            queryParams.append("createdAtInBetweenStartDate", filters.createdAtInBetweenStartDate);
        }
        if (filters.createdAtInBetweenEndDate) {
            queryParams.append("createdAtInBetweenEndDate", filters.createdAtInBetweenEndDate);
        }
        for (const key in filters) {
            if (key !== "search" && key !== "searchType" && key !== "name" && key !== "email" && key !== "phoneNumber" && filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
                queryParams.append(key, filters[key]);
            }
        }
        // --- End of filter logic ---

        const response = yield call(
            axios.get,
            `${API_BASE_URL}/users?${queryParams.toString()}`, // Use base URL
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const { users, totalPages, totalUsers } = response.data;
        yield put(fetchUsersSuccess({ users, page, limit, totalPages, totalUsers, count: users.length }));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(fetchUsersFailure(errorMessage));
        toast.error(errorMessage); // Add error toast
    }
}

function* fetchUserDetailSaga(action) {
    try {
        const token = getAdminToken();
        if (!token) throw new Error("No authorization token found");
        const response = yield call(
            axios.get,
            `${API_BASE_URL}/user/${action.payload}`, // Use base URL
            { headers: { Authorization: `Bearer ${token}` } }
        );
        yield put(fetchUserDetailSuccess(response.data.data.user));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(fetchUserDetailFailure(errorMessage));
        toast.error(errorMessage); // Add error toast
    }
}

function* deleteUserSaga(action) {
    try {
        const token = getAdminToken();
        if (!token) throw new Error("No authorization token found");
        yield call(
            axios.delete,
            `${API_BASE_URL}/user/${action.payload}`, // Use base URL
            { headers: { Authorization: `Bearer ${token}` } }
        );
        yield put(deleteUserSuccess(action.payload));
        toast.success("User deleted successfully!"); // Add success toast
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to delete user";
        yield put(deleteUserFailure(errorMessage));
        toast.error(errorMessage); // Add error toast
    }
}

function* fetchFamilyMembersSaga(action) {
    try {
        const token = getAdminToken();
        if (!token) throw new Error("No authorization token found");
        const { page, limit, ...filters } = action.payload || {};
        const params = new URLSearchParams({ page, limit });
        
        // Simplified filter logic
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                params.append(key, value);
            }
        });

        const url = `${API_BASE_URL}/familyMembers?${params.toString()}`;
        const response = yield call(axios.get, url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const { data, total, page: currentPage, limit: perPage } = response.data;
        const totalPages = Math.ceil(total / perPage);
        yield put(fetchFamilyMembersSuccess({ data, total, page: currentPage, limit: perPage, totalPages }));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(fetchFamilyMembersFailure(errorMessage));
        toast.error(errorMessage); // Add error toast
    }
}


function* fetchSingleFamilyMemberSaga(action) {
    try {
        const { id, token } = action.payload;
        const { data } = yield call(
            axios.get,
            `${API_BASE_URL}/familyMember/${id}`, // Use base URL
            { headers: { Authorization: `Bearer ${token}` } }
        );
        yield put(fetchSingleFamilyMemberSuccess(data));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(fetchSingleFamilyMemberFailure(errorMessage));
        toast.error(errorMessage); // Add error toast
    }
}


// ✨ CHANGE 3: Add toasts and use base URL in this function
function* deleteFamilyMemberSaga(action) {
    try {
        const token = getAdminToken();
        if (!token) throw new Error("No authorization token found");

        yield call(
            axios.delete,
            `${API_BASE_URL}/familyMember/${action.payload}`, // Use base URL
            { headers: { Authorization: `Bearer ${token}` } }
        );

        yield put(deleteFamilyMemberSuccess(action.payload));
        toast.success("Family member deleted successfully!"); // Add success toast

        // Re-fetch user details to update the UI (as you implemented)
        const userDetail = yield select(state => state.users.userDetail);
        if (userDetail && userDetail._id) {
            yield put(fetchUserDetailRequest(userDetail._id));
        }

    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to delete family member";
        yield put(deleteFamilyMemberFailure(errorMessage));
        toast.error(errorMessage); // Add error toast
    }
}

function* fetchScheduledCallsSaga(action) {
    try {
        const token = getAdminToken();
        if (!token) throw new Error("No authorization token found");
        
        const cleanPayload = Object.fromEntries(
            Object.entries(action.payload || {}).filter(([, v]) => v !== "" && v !== null && v !== undefined)
        );
        
        const url = `${API_BASE_URL}/scheduledCalls`; // Use base URL
        const response = yield call(axios.get, url, {
            headers: { Authorization: `Bearer ${token}` },
            params: cleanPayload,
        });

        const { data = [], total = 0, page = 1, limit = 10 } = response.data;
        yield put(fetchScheduledCallsSuccess({ data, total, page, limit }));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(fetchScheduledCallsFailure(errorMessage));
        toast.error(errorMessage); // Add error toast
    }
}

function* deleteScheduledCallSaga(action) {
    try {
        const token = getAdminToken();
        if (!token) throw new Error("No authorization token found");
        yield call(
            axios.delete,
            `${API_BASE_URL}/deleteScheduledCall/${action.payload}`, // Use base URL
            { headers: { Authorization: `Bearer ${token}` } }
        );
        yield put(deleteScheduledCallSuccess(action.payload));
        toast.success("Scheduled call deleted successfully!"); // Add success toast
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(deleteScheduledCallFailure(errorMessage));
        toast.error(errorMessage); // Add error toast
    }
}


export default function* usersRootSaga() {
    yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);
    yield takeLatest(fetchUserDetailRequest.type, fetchUserDetailSaga);
    yield takeLatest(deleteUserRequest.type, deleteUserSaga);
    yield takeLatest(fetchFamilyMembersRequest.type, fetchFamilyMembersSaga);
    yield takeLatest(fetchSingleFamilyMemberRequest.type, fetchSingleFamilyMemberSaga);
    yield takeLatest(deleteFamilyMemberRequest.type, deleteFamilyMemberSaga);
    yield takeLatest(fetchScheduledCallsRequest.type, fetchScheduledCallsSaga);
    yield takeLatest(deleteScheduledCallRequest.type, deleteScheduledCallSaga);
}