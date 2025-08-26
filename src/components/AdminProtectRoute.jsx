
// src/components/AdminProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    // Agar login nahi hai -> login page par bhejo
    // Aap chahein to ise "/admin-login" bhi kar sakte hain
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    // Agar user admin nahi hai -> uske apne dashboard par bhejo
    return <Navigate to="/dashboard" replace />;
  }

  // Agar sab theek hai (logged-in hai aur admin hai) -> page dikhao
  return children;
}