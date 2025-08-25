// src/components/PublicRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    // Agar user logged-in hai, to use uske role ke dashboard par bhejo
    if (user?.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Agar logged-in nahi hai, to public page dikhao (e.g., Login, Signup)
  return children;
}