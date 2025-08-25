


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleFamilyMemberRequest } from "../../../redux/userSlice";
import { useParams, useNavigate } from "react-router-dom";
import { getAdminToken } from "../../../utils/adminAuth";
import { ArrowLeftIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const MemberDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { singleFamilyMember, loading, error } = useSelector(
    (state) => state.users
  );
  
  // Extracting data with optional chaining for safety
  const member = singleFamilyMember?.data?.familyMember;
  const associatedUser = singleFamilyMember?.data?.user;

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate("/admin-login");
      return;
    }
    dispatch(fetchSingleFamilyMemberRequest({ id, token }));
  }, [id, dispatch, navigate]);

  const getAvatar = (name) => (
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl sm:text-4xl bg-[#3FBF81]">
      {name ? name.charAt(0).toUpperCase() : "?"}
    </div>
  );

  // Helper for displaying key-value pairs
  const DetailItem = ({ label, value }) => (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value || "N/A"}</p>
    </div>
  );

  if (loading) {
    return <div className="p-5 text-center text-gray-500 min-h-screen flex items-center justify-center">Loading member details...</div>;
  }
  if (error) {
    return <div className="p-5 text-center text-red-500 min-h-screen flex items-center justify-center">Error: {error}</div>;
  }
  if (!member) {
    return <div className="p-5 text-center text-gray-600 min-h-screen flex items-center justify-center">Member not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
      
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl">
        <div className="flex items-center gap-4">
          {getAvatar(member.name)}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{member.name}</h1>
            {/* highlight-start */}
            {/* <p className="text-[#3FBF81] font-semibold">{member.relationship || "Relationship not specified"}</p> */}
            <p className="text-gray-600 text-sm sm:text-base mt-1">{member.email || "No Email"}</p>
            <p className="text-gray-600 text-sm sm:text-base">{member.phoneNumber || "No Phone Number"}</p>
            {/* highlight-end */}
          </div>
        </div>
        {/* <button 
          onClick={() => navigate(-1)} 
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition w-full sm:w-auto"
        >
          <ArrowLeftIcon className="w-5 h-5" /> Back
        </button> */}
      </div>

      {/* highlight-start */}
      {/* Additional Details Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 p-2">Additional Details</h2>
        <div className="p-5 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <DetailItem label="Account Type" value={member.isUser ? 'Primary User' : 'Dependent Member'} />
            <DetailItem label="Record Created On" value={new Date(member.createdAt).toLocaleDateString('en-GB')} />
            <DetailItem label="Last Updated On" value={new Date(member.updatedAt).toLocaleDateString('en-GB')} />
        </div>
      </div>
      {/* highlight-end */}

      {/* Associated User Section */}
      {associatedUser && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 p-2">Associated With</h2>
          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <UserCircleIcon className="w-12 h-12 text-gray-400"/>
              <div>
                <p className="font-bold text-gray-800">{associatedUser.name}</p>
                <p className="text-sm text-gray-600">{associatedUser.email}</p>
                <p className="text-sm text-gray-600">{associatedUser.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MemberDetail;