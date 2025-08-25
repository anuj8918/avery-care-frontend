

import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from "./components/PublicRoute";
import AdminProtectedRoute from "./components/AdminProtectRoute";

// Toastify CSS for notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-input-2/lib/style.css";

// --- Public Pages ---
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import VerifyOtp from "./components/pages/VerifyOtp";
import NotFound from "./components/pages/404";

// --- User Dashboard Pages ---
import Dashboard from "./components/pages/dashboard/Dashboard";
import FamilyMembers from "./components/pages/dashboard/FamilyMembers";
import FamilyMembersDetails from './components/pages/dashboard/FamilyMemberDetails';
import ScheduleHealthCall from "./components/pages/dashboard/ScheduleHealthCall";
import CallHistory from "./components/pages/dashboard/CallHistory";
import CallDetails from "./components/pages/dashboard/CallDetails";
import UpdateProfile from "./components/pages/dashboard/Settings";

// --- Admin Dashboard Pages ---
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import Overview from "./components/pages/admin/Overview";
import User from "./components/pages/admin/User";
import Historycall from "./components/pages/admin/Historycall";
import UserDetail from "./components/pages/admin/UserDetail";
import Members from "./components/pages/admin/Members";
import MemberDetail from "./components/pages/admin/MemberDetail";
import CallDetailsAdmin from "./components/pages/admin/CallDetails";

function Layout() {
    const location = useLocation();

    // Logic to identify admin routes
    const isAdminRoute = location.pathname.startsWith('/admin-dashboard');

    // Logic to decide when to show the user's sidebar
    const isUserDashboardRoute = [
        "/dashboard", "/family-members", "/schedule",
        "/history", "/settings"
    ].includes(location.pathname) || 
    location.pathname.startsWith("/family/") || 
    location.pathname.startsWith("/call-details");
    
    const showSidebar = isUserDashboardRoute && !isAdminRoute;

    // ✅ YAHAN CHANGE HAI: Hum route ke hisaab se main content ki styling badal rahe hain
    const mainContentClasses = isAdminRoute
      ? 'flex-1 bg-white' // Admin pages ke liye: white background aur koi extra padding nahi
      : 'flex-1 p-4 sm:p-6 lg:p-8'; // User/Public pages ke liye: gray background aur padding

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1">
                {showSidebar && <Sidebar />}
                {/* Ab className dynamic ho gaya hai */}
                <main className={mainContentClasses}>
                    <Routes>
                        {/* --- Public Routes --- */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/signup" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />

                        {/* --- User Protected Routes --- */}
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/family-members" element={<ProtectedRoute><FamilyMembers /></ProtectedRoute>} />
                        <Route path="/family/:id" element={<ProtectedRoute><FamilyMembersDetails /></ProtectedRoute>} />
                        <Route path="/schedule" element={<ProtectedRoute><ScheduleHealthCall /></ProtectedRoute>} />
                        <Route path="/history" element={<ProtectedRoute><CallHistory /></ProtectedRoute>} />
                        <Route path="/call-details" element={<ProtectedRoute><CallDetails /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />

                        {/* --- Admin Protected Routes (Nested inside AdminDashboard) --- */}
                        <Route 
                            path="/admin-dashboard" 
                            element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>}
                        >
                            <Route index element={<Overview />} />
                            <Route path="users" element={<User />} />
                            <Route path="history-call" element={<Historycall />} />
                            <Route path="history-call/:id" element={<CallDetailsAdmin />} />
                            <Route path="user/:id" element={<UserDetail />} />
                            <Route path="members" element={<Members />} />
                            <Route path="members/:id" element={<MemberDetail />} />
                        </Route>

                        {/* --- Not Found Route --- */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
            {/* {!isAdminRoute && <Footer />} */}
            <Footer />
        </div>
    );
}

// Main App Component
export default function App() {
    return (
        <Router>
            <Layout />
            <ToastContainer 
                position="top-right" 
                autoClose={3000} 
                hideProgressBar={false}
            />
        </Router>
    );
}