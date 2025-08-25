import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchFamilyMembersRequest } from "../../../redux/familySlice";
import {
  fetchScheduledCallsRequest,
  clearCallMessages,
} from "../../../redux/callSlice";
import { toast } from "react-toastify";
import {
  User,
  Phone,
  Lock,
  HelpCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Mail,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import CallHistoryTable from "../dashboard/CallHistoryTable"; // Path to CallHistoryTable component

const SettingsPage = () => {
  const [openSection, setOpenSection] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { familyMembers, meta } = useSelector((state) => state.family);
  const { scheduledCalls, loading: callsLoading, error: callsError } = useSelector(
    (state) => state.call
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const familyCount = meta?.total || 0;

  useEffect(() => {
    dispatch(fetchFamilyMembersRequest());
    if (user?._id) {
      dispatch(
        fetchScheduledCallsRequest({
          page: currentPage,
          limit: itemsPerPage,
          
          // `scheduledToId` filter ka upyog karke sirf user ke liye scheduled calls fetch karein
          scheduledToId: user._id,
        })
      );
    }
  }, [dispatch, user?._id, currentPage, itemsPerPage]);

  const allFetchedCallsArray = scheduledCalls?.data || [];
  const totalCalls = scheduledCalls?.total || 0;
  const totalPages = Math.ceil(totalCalls / itemsPerPage);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const getAvatar = (name) => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : "";
    return (
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl sm:text-4xl"
        style={{ backgroundColor: "#3fbf81" }}
      >
        {firstLetter}
      </div>
    );
  };

  const [phoneData, setPhoneData] = useState({
    oldPhone: user?.phoneNumber || "",
    newPhone: "",
    password: "",
  });

  const handlePhoneChange = (value) => {
    if (!value.startsWith("91")) {
      value = "91" + value.replace(/^(\+?91)?/, "");
    }
    setPhoneData((prev) => ({ ...prev, newPhone: `+${value}` }));
  };

  const handlePhoneKeyDown = (e) => {
    const input = e.target;
    const caretPosition = input.selectionStart;
    if ((e.key === "Backspace" || e.key === "Delete") && caretPosition <= 3) {
      e.preventDefault();
    }
  };

  const updatePhone = () => {
    toast.success(`Phone updated to: ${phoneData.newPhone}`);
    setPhoneData({ ...phoneData, newPhone: "", password: "" });
  };

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const updatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Password updated successfully!");
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const deleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      toast.info("Your account is being deleted.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-white sm:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Settings
      </h2>

      {/* -------- Personal Info Section -------- */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("profile")}
          className="w-full flex items-center gap-3 py-3 text-gray-900 font-semibold text-lg"
        >
          <User className="w-5 h-5 text-gray-700" />
          Personal Info
          {openSection === "profile" ? (
            <ChevronUp className="ml-auto w-5 h-5" />
          ) : (
            <ChevronDown className="ml-auto w-5 h-5" />
          )}
        </button>

        {openSection === "profile" && (
          <div className="p-5 rounded-xl bg-white mt-3">
            <div className="flex items-center gap-4">
              {getAvatar(user?.name)}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{user?.name}</h1>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-gray-600">{user?.phoneNumber}</p>
                <p> <span className="text-gray-600">Total Members Linked:</span> {familyCount}</p>
              </div>
            </div>

            {/* Health Details Dummy (like FamilyMemberDetails) */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Health Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Conditions", value: "None" },
                  { label: "Medications", value: "None" },
                  { label: "Allergies", value: "None" },
                  { label: "Preferences", value: "Prefers evening calls" },
                ].map((item, idx) => (
                  <div key={idx}>
                    <p className="text-sm font-medium text-gray-600">
                      {item.label}
                    </p>
                    <p className="text-gray-800 font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Call History */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Your Call History
                </h2>
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || callsLoading}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                      title="Previous Page"
                    >
                      <ArrowLeft className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="text-gray-700 text-sm font-medium">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || callsLoading}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                      title="Next Page"
                    >
                      <ArrowRight className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                )}
              </div>

              {callsLoading && allFetchedCallsArray.length === 0 ? (
                <p className="text-gray-500">
                  Loading call history for {user?.name}...
                </p>
              ) : callsError ? (
                <p className="text-red-500">Error loading calls: {callsError}</p>
              ) : (
                <CallHistoryTable calls={allFetchedCallsArray} />
              )}
              {!callsLoading &&
                !callsError &&
                allFetchedCallsArray.length === 0 && (
                  <p className="text-gray-500 italic mt-4">
                    No Calls found for {user?.name}.
                  </p>
                )}
            </div>
          </div>
        )}
      </div>

      {/* -------- Change Phone Number -------- */}
      <div className="mt-5">
        <button
          type="button"
          onClick={() => toggleSection("phone")}
          className="w-full flex items-center gap-3 py-3 text-gray-900 font-semibold text-lg"
        >
          <Phone className="w-5 h-5 text-gray-700" />
          Change Number
          {openSection === "phone" ? (
            <ChevronUp className="ml-auto w-5 h-5" />
          ) : (
            <ChevronDown className="ml-auto w-5 h-5" />
          )}
        </button>

        {openSection === "phone" && (
          <div className="pl-6 sm:pl-8 pt-3 space-y-3 text-gray-700">
            <p className="text-sm">
              <strong>Current Phone:</strong> {user?.phoneNumber || "N/A"}
            </p>

            <div>
              <label className="block text-sm font-medium mb-1">
                New Phone Number
              </label>
              <PhoneInput
                country={"in"}
                onlyCountries={["in"]}
                disableDropdown={true}
                value={phoneData.newPhone}
                onChange={handlePhoneChange}
                inputProps={{
                  onKeyDown: handlePhoneKeyDown,
                  name: "phoneNumber",
                  required: true,
                }}
                inputStyle={{
                  width: "100%",
                  maxWidth: "250px",
                  padding: "8px 12px",
                  marginLeft: "35px",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
                buttonStyle={{
                  borderRadius: "8px 0 0 8px",
                  border: "1px solid #d1d5db",
                  padding: "0 5px 0",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={phoneData.password}
                onChange={(e) =>
                  setPhoneData((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Enter your password"
                className="mt-1 w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fbf81] text-sm"
              />
            </div>

            <button
              onClick={updatePhone}
              className="bg-[#3fbf81] hover:bg-[#36a973] text-white px-4 py-2 rounded-md text-sm mt-2"
            >
              Update Phone
            </button>
          </div>
        )}
      </div>

      {/* -------- Change Password -------- */}
      <div className="mt-5">
        <button
          type="button"
          onClick={() => toggleSection("password")}
          className="w-full flex items-center gap-3 py-3 text-gray-900 font-semibold text-lg"
        >
          <Lock className="w-5 h-5 text-gray-700" />
          Change Password
          {openSection === "password" ? (
            <ChevronUp className="ml-auto w-5 h-5" />
          ) : (
            <ChevronDown className="ml-auto w-5 h-5" />
          )}
        </button>

        {openSection === "password" && (
          <div className="pl-6 sm:pl-8 pt-3 space-y-3 text-gray-700">
            <div>
              <label className="block text-sm font-medium">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Enter old password"
                className="mt-1 w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fbf81] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="mt-1 w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fbf81] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="mt-1 w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fbf81] text-sm"
              />
            </div>

            <button
              onClick={updatePassword}
              className="bg-[#3fbf81] hover:bg-[#36a973] text-white px-4 py-2 rounded-md text-sm mt-2"
            >
              Update Password
            </button>
          </div>
        )}
      </div>

      {/* -------- Help & Support -------- */}
      <div className="mt-5">
        <button
          type="button"
          onClick={() => toggleSection("help")}
          className="w-full flex items-center gap-3 py-3 text-gray-900 font-semibold text-lg"
        >
          <HelpCircle className="w-5 h-5 text-gray-700" />
          Help & Support
          {openSection === "help" ? (
            <ChevronUp className="ml-auto w-5 h-5" />
          ) : (
            <ChevronDown className="ml-auto w-5 h-5" />
          )}
        </button>

        {openSection === "help" && (
          <div className="pl-6 sm:pl-8 pt-3 space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-600" />
              <a
                href="mailto:support@example.com"
                className="text-blue-600 underline"
              >
                Email Support
              </a>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gray-600" />
              <a href="/faq" className="text-blue-600 underline">
                FAQs & Help Center
              </a>
            </div>
          </div>
        )}
      </div>

      {/* -------- Delete Account -------- */}
      <div className="pt-4">
        <button
          type="button"
          onClick={() => toggleSection("delete")}
          className="w-full flex items-center gap-3 py-3 font-semibold text-lg "
        >
          <Trash2 className="w-5 h-5 " />
          Delete Account
          {openSection === "delete" ? (
            <ChevronUp className="ml-auto w-5 h-5" />
          ) : (
            <ChevronDown className="ml-auto w-5 h-5" />
          )}
        </button>

        {openSection === "delete" && (
          <div className="pl-6 sm:pl-8 pt-3 text-gray-700">
            <p className="text-sm mb-3">
              Deleting your account will remove all your data permanently. This
              action cannot be undone.
            </p>
            <button
              onClick={deleteAccount}
              className="bg-[#3FBF81] hover:bg-[#36a973] text-white px-4 py-2 rounded-md text-sm cursor-pointer"
            >
              Confirm Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
