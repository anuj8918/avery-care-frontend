import React, { useState, useEffect } from "react";
import {
  signupRequest,
  clearSuccessMessage,
  clearError,
} from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, email } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handlePhoneChange = (value, country) => {
  setFormData((prevData) => ({
    ...prevData,
    phoneNumber: `+${value}`, //  Force plus sign
  }));
};

  const handlePhoneKeyDown = (e) => {
    const input = e.target;
    const caretPosition = input.selectionStart;
    if ((e.key === "Backspace" || e.key === "Delete") && caretPosition <= 3) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send phone number with country code directly
    dispatch(signupRequest(formData));
  };

  useEffect(() => {
    if (successMessage && email) {
      navigate("/verify-otp", {
        state: { email: formData.email, phone: formData.phoneNumber },
      });
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, email, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <div className="sm:min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 bg-white pt-6 max-sm:mb-40 max-sm:px-8">
      <div className="text-center mb-8 max-sm:mt-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Create an Account
        </h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Sign up and start your journey
        </p>
      </div>

      <form className="w-full max-w-md space-y-5" onSubmit={handleSubmit}>
        <div className="w-full">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none
              focus:ring-2 focus:ring-[#3fbf81] focus:border-[#3fbf81] placeholder-gray-400 transition"
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none
              focus:ring-2 focus:ring-[#3fbf81] focus:border-[#3fbf81] placeholder-gray-400 transition"
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <PhoneInput
            country={"in"}
            onlyCountries={["in"]}
            disableDropdown={true}
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            inputProps={{
              onKeyDown: handlePhoneKeyDown,
              name: "phoneNumber",
              required: true,
            }}
            inputStyle={{
              width: "100%",
              height: "48px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "16px",
              paddingLeft: "60px",
            }}
            buttonStyle={{
              borderRadius: "8px 0 0 8px",
              border: "1px solid #d1d5db",
              padding: "0 5px 0",
            }}
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none
              focus:ring-2 focus:ring-[#3fbf81] focus:border-[#3fbf81] placeholder-gray-400 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full text-lg font-semibold text-white bg-[#3fbf81]
            hover:bg-[#34a06c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fbf81] transition-all"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-700">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#3fbf81] hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
