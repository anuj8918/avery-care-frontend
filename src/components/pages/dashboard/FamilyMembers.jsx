import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchFamilyMembersRequest,
    addFamilyMemberRequest,
    deleteFamilyMemberRequest,
} from "../../../redux/familySlice";
import { UserPlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function FamilyMembers() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state
    const { familyMembers, loading, meta } = useSelector((state) => state.family);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        relationship: "",
        email: "",
        phoneNumber: "+91",
    });

    const [page, setPage] = useState(1);
    const limit = 5;

    // Fetch members on mount / page change
    useEffect(() => {
        dispatch(fetchFamilyMembersRequest({ page, limit }));
    }, [dispatch, page, limit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (value) => {
        setFormData({
            ...formData,
            phoneNumber: value.startsWith("+") ? value : "+" + value,
        });
    };

    const handleAddMember = () => {
        if (
            !formData.name ||
            !formData.relationship ||
            !formData.email ||
            !formData.phoneNumber ||
            formData.phoneNumber === "+91"
        ) {
            alert("Please fill in all fields.");
            return;
        }

        dispatch(addFamilyMemberRequest(formData));
        setFormData({ name: "", relationship: "", email: "", phoneNumber: "+91" });
    };



    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this family member?")) {
            dispatch(deleteFamilyMemberRequest(id));
        }
    };

    const handleDetails = (member) => {
        navigate(`/family/${member._id}`, { state: member });
    };

    return (
        <div className="flex flex-col md:flex-row sm:px-8 lg:px-12 gap-10 min-h-screen bg-white">
            {/* Left: Add Form */}
            <div className="flex-1 rounded-xl space-y-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Add Family Member
                </h1>

                <div className="space-y-5">
                    {["name", "relationship", "email"].map((field, idx) => (
                        <div key={idx}>
                            <label className="block font-medium mb-2 text-gray-700 capitalize">
                                {field}
                            </label>
                            <input
                                type={field === "email" ? "email" : "text"}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                placeholder={`Enter ${field}`}
                                className="w-full rounded-md px-4 py-2 bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#3fbf81] transition"
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block font-medium mb-2 text-gray-700">
                            Phone Number
                        </label>
                        <PhoneInput
                            country={"in"}
                            onlyCountries={["in"]}
                            countryCodeEditable={false}
                            disableDropdown={true}
                            value={formData.phoneNumber}
                            onChange={handlePhoneChange}
                            inputStyle={{
                                width: "90%",
                                marginLeft: "30px",
                                borderRadius: "0.375rem",
                                padding: "0.5rem 1rem",
                                height: "42px",
                                border: "1px solid #d1d5db",
                            }}
                            containerStyle={{ width: "100%" }}
                        />
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleAddMember}
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-2 bg-[#3fbf81] text-white font-medium rounded-full hover:bg-[#36a973] transition text-sm sm:text-base ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            <UserPlusIcon className="w-5 h-5" />
                            {loading ? "Processing..." : "Add Family Member"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Members List */}
            <div className="flex-1 mt-4 md:mt-4 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Added Family Members
                    </h2>

                    {/* Pagination Controls -- UPDATED SECTION */}
                    {/* Pagination Controls -- UPDATED SECTION */}
                    {meta?.total > limit && (
                        <div className="flex items-center space-x-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className={`px-3 py-1 rounded-full text-xl font-bold ${page === 1
                                    ? "text-gray-400"
                                    : "text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                &laquo;
                            </button>

                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                {meta?.page || page} / {Math.ceil(meta?.total / limit) || 1}
                            </span>

                            <button
                                disabled={!meta?.hasNextPage}
                                onClick={() => setPage(page + 1)}
                                className={`px-3 py-1 rounded-full text-xl font-bold ${!meta?.hasNextPage
                                    ? "text-gray-400"
                                    : "text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                &raquo;
                            </button>
                        </div>
                    )}

                </div>

                {loading && familyMembers.length === 0 && (
                    <p className="text-gray-500 italic mt-4">Loading family members...</p>
                )}

                {!loading && familyMembers.length === 0 ? (
                    <p className="text-gray-500 italic mt-4">
                        No family members added yet.
                    </p>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {familyMembers.map((member) => (
                            <div
                                key={member._id}
                                className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-lg transition"
                            >
                                <div>
                                    <p className="font-medium text-lg text-gray-900">
                                        {member.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {member.relationship}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleDelete(member._id)}
                                        className="text-red-500 hover:text-red-700 transition"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDetails(member)}
                                        className="px-4 py-1 text-sm font-medium text-[#3fbf81] border border-[#3fbf81] rounded-full hover:bg-[#3fbf81] hover:text-white transition"
                                    >
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}