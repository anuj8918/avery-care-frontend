import { createSlice } from "@reduxjs/toolkit";

const callSlice = createSlice({
  name: "call",
  initialState: {
    loading: false,
    error: null,
    scheduledCalls: {
      data: [],
      total: 0,
      page: 1,
      limit: 5,
    },
    message: null,
  },
  reducers: {
    scheduleHealthCallRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    scheduleHealthCallSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    scheduleHealthCallFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    fetchScheduledCallsRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchScheduledCallsSuccess: (state, action) => {
      state.loading = false;
      state.scheduledCalls.data = action.payload.data;
      state.scheduledCalls.total = action.payload.total;
      state.scheduledCalls.page = action.payload.page;
      state.scheduledCalls.limit = action.payload.limit;
      state.error = null;
    },
    fetchScheduledCallsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    updateScheduledCallRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateScheduledCallSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    updateScheduledCallFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // Updated: This action now expects an object payload
    deleteScheduledCallRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteScheduledCallSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    deleteScheduledCallFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    clearCallMessages: (state) => {
      state.error = null;
      state.message = null;
    },
  },
});

export const {
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
  clearCallMessages,
} = callSlice.actions;

export default callSlice.reducer;