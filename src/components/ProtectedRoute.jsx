// // src/components/ProtectedRoute.jsx
// import React from "react";
// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   //   Agar login nahi hai → login page par redirect
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

// src/components/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    // Agar login nahi hai -> login page par bhejo
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "admin") {
    // Agar admin regular user ke page par aane ki koshish kare -> admin dashboard bhejo
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Agar sab theek hai (logged-in hai aur regular user hai) -> page dikhao
  return children;
}