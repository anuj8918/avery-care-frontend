import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import Logo from "../assets/AveryCareLogo1.png";

// Import icons
import {
  QuestionMarkCircleIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  PhoneIcon as CallIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CalendarIcon,
  ClockIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

// Regular user navigation items
const navItems = [
  { id: "dashboard", name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
  { id: "schedule", name: "Schedule", icon: CalendarIcon, path: "/schedule" },
  { id: "history", name: "All Calls", icon: ClockIcon, path: "/history" },
  { id: "family", name: "Family Members", icon: UserGroupIcon, path: "/family-members" },
  { id: "settings", name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
];

// Admin navigation items
const adminNavItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/admin-dashboard', icon: HomeIcon },
    { id: 'users', name: 'Users', path: '/admin-dashboard/users', icon: UsersIcon },
    { id: 'members', name: 'Family Members', path: '/admin-dashboard/members', icon: UserGroupIcon },
    { id: 'callhistory', name: 'All Calls', path: '/admin-dashboard/history-call', icon: CallIcon },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const isAdmin = user?.role === 'admin';

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);


  return (
    <header className="relative flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 lg:px-10 py-3 bg-white shadow-xs z-20">
      <Link to={isAdmin ? "/admin-dashboard" : "/"} className="flex items-center gap-3 cursor-pointer">
        <img src={Logo} alt="AveryCare Logo" className="w-10 h-10 object-contain" />
        <h2 className="hidden md:block text-[#101815] text-xl font-bold hover:text-[#34a06c] transition-colors">
          AveryCare
        </h2>
      </Link>

      <div className="hidden xl:flex flex-1 justify-end gap-8 items-center">
        {isAuthenticated ? (
          <>
            {!isAdmin && (
                <div className="relative flex items-center w-full max-w-[250px]">
                <MagnifyingGlassIcon className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search for calls, etc."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3fbf81]"
                />
                </div>
            )}

            {!isAdmin && (
                <button className="text-[#101815] hover:text-[#34a06c]">
                    <QuestionMarkCircleIcon className="w-6 h-6" />
                </button>
            )}

            <div className="relative profile-dropdown-container">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-[#3fbf81] flex items-center justify-center text-white font-bold cursor-pointer hover:bg-[#34a06c] transition"
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-[260px] bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4 text-left space-y-3">
                  <h3 className="text-sm font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-3">
                    My Info
                  </h3>
                  {isAdmin ? (
                    <>
                      <div className="flex items-start gap-2 text-gray-700 text-sm break-all">
                        <UsersIcon className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
                        <span>{user?.name || "N/A"}</span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-700 text-sm break-all">
                        <EnvelopeIcon className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
                        <span>{user?.email || "N/A"}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-2 text-gray-700 text-sm break-all">
                        <EnvelopeIcon className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
                        <span>{user?.email || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <CallIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span>{user?.phoneNumber || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <CheckBadgeIcon className="w-4 h-4" />
                        <span>Verified</span>
                      </div>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full bg-[#3FBF81] hover:bg-[#36a973] text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer mt-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link className="text-[#101815] hover:text-[#34a06c]" to="/">About</Link>
            <Link className="text-[#101815] hover:text-[#34a06c]" to="/">Services</Link>
            <Link className="text-[#101815] hover:text-[#34a06c]" to="/">Contact</Link>
            <div className="flex gap-2">
              {!isLoginPage && (
                <Link to="/login" className="rounded-full h-9 px-4 bg-[#3fbf81] text-white text-sm font-bold hover:bg-[#34a06c] flex items-center justify-center">
                  Sign In
                </Link>
              )}
              {!isSignupPage && (
                <Link to="/signup" className="rounded-full h-9 px-4 bg-[#eaf1ed] text-[#101815] text-sm font-bold hover:bg-gray-200 flex items-center justify-center">
                  Sign Up
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      <div className="xl:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
          {isMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full right-4 w-[240px] bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex flex-col gap-2 xl:hidden text-left">
          {isAuthenticated ? (
            <>
              {(isAdmin ? adminNavItems : navItems).map((item) => {
                // highlight-start
                // Logic to check if the link is active
                const isActive = item.id === 'dashboard' 
                    ? location.pathname === item.path // Dashboard ke liye exact match
                    : location.pathname.startsWith(item.path); // Baaki sabke liye prefix match
                // highlight-end

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    // highlight-start
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 ${isActive ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-100'}`}
                    // highlight-end
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-[#3FBF81] hover:bg-[#36a973] text-white px-4 py-2 rounded-md text-sm mt-3"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="text-[#101815] hover:text-[#34a06c]" to="/" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link className="text-[#101815] hover:text-[#34a06c]" to="/" onClick={() => setIsMenuOpen(false)}>Services</Link>
              <Link className="text-[#101815] hover:text-[#34a06c]" to="/" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              {!isLoginPage && (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-[#3fbf81] text-white rounded-full px-3 py-1 text-center hover:bg-[#34a06c] mt-2">
                  Sign In
                </Link>
              )}
              {!isSignupPage && (
                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="bg-[#eaf1ed] text-[#101815] rounded-full px-3 py-1 text-center hover:bg-gray-200">
                  Sign Up
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;