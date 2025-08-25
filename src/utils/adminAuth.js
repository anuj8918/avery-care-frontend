// src/utils/adminAuth.js

// Save admin token to localStorage
export const setAdminToken = (token) => {
  localStorage.setItem("adminToken", token);
};

// Get admin token from localStorage
export const getAdminToken = () => {
  return localStorage.getItem("token");
};

// Remove admin token from localStorage (for logout)
export const removeAdminToken = () => {
  localStorage.removeItem("adminToken");
   localStorage.removeItem("adminEmail");
};
