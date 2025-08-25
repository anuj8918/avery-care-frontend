import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, clearError } from "../../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ✅ Step 1: State se 'user' object ko nikala gaya
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginRequest(formData));
  };

  // ✅ Step 2: Role ke basis par redirect karne ka logic
  // Login.js

// Login.js file mein ye wala useEffect daalo

useEffect(() => {
    console.log("🚀 REDIRECT LOGIC TRIGGERED 🚀");
    console.log("User object state mein hai:", user);
    
    
  // Ye check karega ki authentication hua aur user ka data bhi hai
  if (isAuthenticated && user) {
    
    // --- DEBUGGING START ---
    // console.clear(); // Purana console saaf karne ke liye
    console.log("🚀 REDIRECT LOGIC TRIGGERED 🚀");
    console.log("User object state mein hai:", user);
    console.log("User ka role hai:", user.role);
    console.log("Kya role 'admin' hai? (Check):", user.role === 'admin');
    // --- DEBUGGING END ---

    if (user.role === 'admin') {
      console.log("✅ Faisla: '/admin' par redirect kiya ja raha hai.");
      navigate('/admin-dashboard');
    } else {
      console.log("👉 Faisla: '/dashboard' par redirect kiya ja raha hai.");
      navigate('/dashboard');
    }
  }
}, [isAuthenticated, user, navigate]); // Ye dependencies aisi hi rahengi

  // Error logic
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <div className="sm:min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 bg-white pt-10 sm:pt-16 max-sm:pt-28 max-sm:mb-60 max-sm:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Login to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
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
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
              focus:ring-2 focus:ring-[#3fbf81] focus:border-[#3fbf81] placeholder-gray-400 transition"
          />
          <a
            href="#"
            className="text-sm font-medium text-[#3fbf81] hover:underline mt-2 inline-block"
          >
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full text-lg font-semibold text-white bg-[#3fbf81] 
            hover:bg-[#34a06c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fbf81] transition-all"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-700">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-[#3fbf81] hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}