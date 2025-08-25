import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyOtpRequest,
  clearError,
  clearSuccessMessage,
} from "../../redux/authSlice";
// import { toast } from "react-toastify";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email: initialEmail, phone: initialPhone } = location.state || {};
  const { loading, error, successMessage, email: storedEmail, verified, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const emailToVerify = initialEmail || storedEmail;
  const phoneToVerify = initialPhone; // If you want to make fallback from Redux, you can do that too

  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");

  useEffect(() => {
    if (isAuthenticated && verified) {
      // toast.success("You are already verified and logged in.", { position: "top-right" });
      navigate("/login");
    }
  }, [isAuthenticated, verified, navigate]);

  useEffect(() => {
    if (successMessage) {
      // toast.success(successMessage, { position: "top-right" });
      dispatch(clearSuccessMessage());

      //  Navigate to login if user is verified (ignore isAuthenticated)
      if (verified) {
        navigate("/login");
      }
    }
  }, [successMessage, dispatch, navigate, verified]);

  useEffect(() => {
    if (error) {
      // toast.error(error, { position: "top-right" });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (!emailToVerify) {
    // toast.error("No email provided for verification. Please sign up again.", { position: "top-right" });
    navigate("/signup");
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOtp || !mobileOtp) {
      // toast.error("Please enter both OTPs.", { position: "top-right" });
      return;
    }
    dispatch(
      verifyOtpRequest({
        email: emailToVerify,
        emailOtp,
        mobileOtp,
      })
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-4 lg:px-4">
      <div className="max-w-md w-full space-y-8 p-8 mt-[-12] border border-gray-100 shadow-xs rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Verify OTP
          </h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Enter the OTPs sent to:
            <br />
            <strong className="font-semibold text-[#3fbf81]">
              Email: {emailToVerify}
            </strong>
            <br />
            <strong className="font-semibold text-[#3fbf81]">
              Phone: {phoneToVerify}
            </strong>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email OTP */}
          {/* Email OTP */}
<div>
  <label htmlFor="emailOtp" className="sr-only">
    Email OTP
  </label>
  <input
    id="emailOtp"
    name="emailOtp"
    type="text"
    inputMode="numeric"
    pattern="\d{4}" // regex: exactly 4 digits
    maxLength={4}
    required
    autoComplete="one-time-code"
    placeholder="Enter 4-digit Email OTP"
    value={emailOtp}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, ""); // remove non-digits
      setEmailOtp(value.slice(0, 4)); // restrict to 4 digits
    }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none
               focus:ring-2 focus:ring-[#3fbf81] focus:border-[#3fbf81] placeholder-gray-400 transition"
  />
</div>

{/* Mobile OTP */}
<div>
  <label htmlFor="mobileOtp" className="sr-only">
    Mobile OTP
  </label>
  <input
    id="mobileOtp"
    name="mobileOtp"
    type="text"
    inputMode="numeric"
    pattern="\d{4}"
    maxLength={4}
    required
    autoComplete="one-time-code"
    placeholder="Enter 4-digit Mobile OTP"
    value={mobileOtp}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, "");
      setMobileOtp(value.slice(0, 4));
    }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none
               focus:ring-2 focus:ring-[#3fbf81] focus:border-[#3fbf81] placeholder-gray-400 transition"
  />
</div>


          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 rounded-full text-lg font-semibold text-white bg-[#3fbf81]
                         hover:bg-[#34a06c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fbf81] transition-all"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
