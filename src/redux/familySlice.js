import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    familyMembers: [],
    meta: {
        total: 0,
        page: 1,
        limit: 5,
        remaining: 0,
        hasNextPage: false,
    }, // Initialize meta properly
    selectedFamilyMember: null, // for detail page
    loading: false,
    error: null,
};

const familySlice = createSlice({
    name: "family",
    initialState,
    reducers: {
        fetchFamilyMembersRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchFamilyMembersSuccess: (state, action) => {
            state.loading = false;
            state.familyMembers = action.payload.data;
            state.meta = action.payload.meta; // This now correctly receives the meta object
            state.error = null;
        },
        fetchFamilyMembersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        addFamilyMemberRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        addFamilyMemberSuccess: (state) => {
            state.loading = false;
            // Family members will be re-fetched by a subsequent fetchFamilyMembersRequest dispatch in saga
            state.error = null;
        },
        addFamilyMemberFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        deleteFamilyMemberRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteFamilyMemberSuccess: (state) => {
            state.loading = false;
            // Family members will be re-fetched by a subsequent fetchFamilyMembersRequest dispatch in saga
            state.error = null;
        },
        deleteFamilyMemberFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        updateFamilyMemberRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateFamilyMemberSuccess: (state, action) => {
            state.loading = false;
            const updatedMember = action.payload; // This is the 'familyMember' object from the backend
            // Find and immutably update the member in the list
            state.familyMembers = state.familyMembers.map((member) =>
                member._id === updatedMember._id ? { ...member, ...updatedMember } : member
            );
            // Also update selected if it's the same member
            if (state.selectedFamilyMember?._id === updatedMember._id) {
                state.selectedFamilyMember = { ...state.selectedFamilyMember, ...updatedMember };
            }
            state.error = null;
            
        },
        
        updateFamilyMemberFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        setSelectedFamilyMember: (state, action) => {
            state.selectedFamilyMember = action.payload;
        },
    },
});

export const {
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
    setSelectedFamilyMember,
} = familySlice.actions;

export default familySlice.reducer;