import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, PencilSquareIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import CallHistoryTable from "../dashboard/CallHistoryTable";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFamilyMemberRequest,
  setSelectedFamilyMember,
  fetchFamilyMembersRequest,
} from "../../../redux/familySlice";
import { fetchScheduledCallsRequest } from "../../../redux/callSlice.js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function FamilyMemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedFamilyMember, familyMembers, loading, error } = useSelector(
    (state) => state.family
  );
  const { scheduledCalls, loading: callsLoading, error: callsError } = useSelector(
    (state) => state.call
  );
  const loggedInUserId = useSelector((state) => state.auth.user._id);

  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const member =
    selectedFamilyMember ||
    familyMembers.find((m) => m._id === id || m.id === id);

  useEffect(() => {
    if (!familyMembers.length) {
      dispatch(fetchFamilyMembersRequest());
    }
  }, [dispatch, familyMembers.length]);

  useEffect(() => {
    if (member && (!selectedFamilyMember || selectedFamilyMember._id !== member._id)) {
      dispatch(setSelectedFamilyMember(member));
    }
  }, [dispatch, selectedFamilyMember, member]);

  // Fetch all calls specific to this family member with pagination
  useEffect(() => {
    if (loggedInUserId && id) { // Ensure id is available
      dispatch(
        fetchScheduledCallsRequest({
          page: currentPage,
          limit: itemsPerPage,
          scheduledToId: id, // Fetch calls for this specific family member ID
        })
      );
    }
  }, [dispatch, loggedInUserId, id, currentPage, itemsPerPage]);

  const [editData, setEditData] = useState({
    name: member?.name || "",
    relationship: member?.relationship || "",
    email: member?.email || "",
    phone: member?.phone?.replace(/^\+91/, "") || "",
  });

  useEffect(() => {
    if (member) {
      setEditData({
        name: member.name || "",
        relationship: member.relationship || "",
        email: member.email || "",
        phone: member.phone?.replace(/^\+91/, "") || "",
      });
    }
  }, [member]); // Dependency on 'member' ensures editData updates if member changes

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(
      updateFamilyMemberRequest({
        id: member._id,
        updatedData: {
          name: editData.name,
          email: editData.email,
          phoneNumber: `+91${editData.phone}`,
          relationship: editData.relationship,
        },
      })
    );
    setIsEditing(false);
  };

  useEffect(() => {
    const updatedMember = familyMembers.find((m) => m._id === id || m.id === id);
    if (updatedMember && (!selectedFamilyMember || updatedMember._id !== selectedFamilyMember._id)) {
      dispatch(setSelectedFamilyMember(updatedMember));
    }
  }, [familyMembers, id, dispatch, selectedFamilyMember]);

  const getAvatar = (name) => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : '';
    return (
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl sm:text-4xl"
        style={{ backgroundColor: '#3fbf81' }}
      >
        {firstLetter}
      </div>
    );
  };

  const allFetchedCallsArray = scheduledCalls?.data || [];
  const totalCalls = scheduledCalls?.total || 0;
  const totalPages = Math.ceil(totalCalls / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!member && !loading) {
    return (
      <div className="p-5">
        <p className="text-red-500">Family member not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
      </div>
    );
  }

  if (loading || !member) {
    return (
      <div className="p-5">
        <p className="text-gray-500">Loading member details...</p>
      </div>
    );
  }

  return (
    <div className="sm:ml-8 md:ml-0 min-h-screen bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl">
        <div className="flex items-center gap-4">
          {getAvatar(member?.name)}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{editData.name}</h1>
            <p className="text-gray-600 text-sm sm:text-base">{editData.relationship}</p>
            <p className="text-gray-600 text-sm sm:text-base">
              {editData.email}{editData.email && editData.phone ? ' · ' : ''}{editData.phone ? `+91${editData.phone}` : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition w-full sm:w-auto"
            disabled={loading}
          >
            <PencilSquareIcon className="w-5 h-5" />
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {isEditing && (
        <div className="mt-4 p-5 rounded-xl">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Edit Member Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ label: "Full Name", name: "name", type: "text" }, { label: "Relationship", name: "relationship", type: "text" }, { label: "Email", name: "email", type: "email" }].map((field, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={editData[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3fbf81] outline-none"
                />
              </div>
            ))}

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <PhoneInput
                country={"in"}
                onlyCountries={["in"]}
                countryCodeEditable={false}
                disableDropdown={true}
                value={`91${editData.phone}`}
                onChange={(value) => {
                  const clean = value.replace(/^91/, "");
                  if (/^\d{0,10}$/.test(clean)) {
                    setEditData({ ...editData, phone: clean });
                  }
                }}
                inputStyle={{
                  width: "94%",
                  marginLeft: "32px",
                  height: "41px",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  border: "1px solid #d1d5db",
                }}
                containerStyle={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#3fbf81] text-white font-medium rounded-full hover:bg-[#36a973] transition w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 p-5 rounded-xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Health Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[{ label: "Conditions", value: "None" }, { label: "Medications", value: "None" }, { label: "Allergies", value: "None" }, { label: "Preferences", value: "Prefers calls in the evening" }].map((item, idx) => (
            <div key={idx}>
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="text-gray-800 font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-5 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Call History</h2>
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              {/* <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || callsLoading}
                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                title="Previous Page"
              >
                <ArrowLeftIcon className="w-4 h-4 text-gray-700" />
              </button> */}
              {/* <span className="text-gray-700 text-sm font-medium">
                {currentPage} / {totalPages}
              </span> */}
              {/* <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || callsLoading}
                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                title="Next Page"
              >
                <ArrowRightIcon className="w-4 h-4 text-gray-700" />
              </button> */}
            </div>
          )}
        </div>
        {callsLoading && allFetchedCallsArray.length === 0 ? (
          <p className="text-gray-500">Loading call history for {member?.name}...</p>
        ) : callsError ? (
          <p className="text-red-500">Error loading calls: {callsError}</p>
        ) : (
          <CallHistoryTable
            calls={allFetchedCallsArray}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            loading={callsLoading}
            scheduledToId={id} // Pass the family member ID to the table
          />
        )}
        {!callsLoading && !callsError && allFetchedCallsArray.length === 0 && (
          <p className="text-gray-500 italic mt-4">
            No Calls found for {member?.name}.
          </p>
        )}
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-[#3fbf81] text-white rounded-full hover:bg-[#36a973] transition sm:w-auto"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back
      </button>
    </div>
  );
}