

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetailRequest, deleteFamilyMemberRequest } from "../../../redux/userSlice";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";

const UserDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { userDetail, loading, error } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUserDetailRequest(id));
    }, [dispatch, id]);

    const handleDeleteFamilyMember = (familyMemberId) => {
        if (window.confirm("Are you sure you want to delete this family member?")) {
            dispatch(deleteFamilyMemberRequest(familyMemberId));
        }
    };

    const getAvatar = (name) => (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl sm:text-4xl bg-[#3fbf81]">
            {name ? name.charAt(0).toUpperCase() : "?"}
        </div>
    );

    const DetailItem = ({ label, value, colorClass = 'text-gray-800' }) => (
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className={`font-semibold ${colorClass}`}>{value || "N/A"}</p>
        </div>
    );

    if (loading) {
        return <div className="p-5 text-center text-gray-500 min-h-screen flex items-center justify-center">Loading user details...</div>;
    }
    if (error) {
        return <div className="p-5 text-center text-red-500 min-h-screen flex items-center justify-center">Error: {error}</div>;
    }
    if (!userDetail) {
        return <div className="p-5 text-center text-gray-600 min-h-screen flex items-center justify-center">User not found.</div>;
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl">
                <div className="flex items-center gap-4">
                    {getAvatar(userDetail.name)}
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{userDetail.name}</h1>
                        <p className="text-gray-600 text-sm sm:text-base">{userDetail.email}</p>
                        <p className="text-gray-600 text-sm sm:text-base">{userDetail.phoneNumber}</p>
                    </div>
                </div>
            </div>

            {/* Additional Details Section */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 p-2">Additional Details</h2>
                <div className="p-5 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <DetailItem
                        label="Account Status"
                        value={userDetail.isVerified ? 'Verified' : 'Not Verified'}
                        colorClass={userDetail.isVerified ? 'text-green-600' : 'text-yellow-600'}
                    />
                    <DetailItem label="Role" value={userDetail.role?.charAt(0).toUpperCase() + userDetail.role?.slice(1)} />
                    <DetailItem label="Account Created On" value={new Date(userDetail.createdAt).toLocaleDateString('en-GB')} />
                </div>
            </div>

            {/* Family Members Section */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 p-2">
                    Family Members ({userDetail.familyMembers?.length || 0})
                </h2>
                {userDetail.familyMembers?.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100 text-left text-gray-700">
                                <tr>
                                    <th className="py-2 px-3 font-medium text-sm sm:text-base">Name</th>
                                    <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base">Email</th>
                                    <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base">Phone</th>
                                    <th className="py-2 px-3 font-medium text-sm sm:text-base">Relationship</th>
                                    <th className="py-2 px-3 font-medium text-sm sm:text-base text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userDetail.familyMembers.map((fm) => (
                                    <tr key={fm._id} className="border-b border-gray-200 last:border-none hover:bg-gray-50 transition">
                                        <td className="py-2 px-3 font-medium text-sm text-gray-800">{fm.member?.name}</td>
                                        <td className="hidden sm:table-cell py-2 px-3 text-sm text-gray-600">{fm.member?.email || "N/A"}</td>
                                        <td className="hidden sm:table-cell py-2 px-3 text-sm text-gray-600">{fm.member?.phoneNumber || "N/A"}</td>
                                        <td className="py-2 px-3 text-sm text-gray-600">{fm.relationship}</td>
                                        <td className="py-2 px-3 text-center">
                                            <button
                                                onClick={() => handleDeleteFamilyMember(fm.member._id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                title="Delete Family Member"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 italic rounded-lg">
                        No family members have been added for this user.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetail;