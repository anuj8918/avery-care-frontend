import React from "react";
import { useNavigate } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-20 min-h-screen bg-white px-6 text-center">
      {/*  Large Error Code */}
      <h1 className="text-[100px] font-extrabold text-[#3fbf81]">404</h1>

      {/*  Message */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Oops! Page not found
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.  
        Let’s get you back on track.
      </p>

      {/*  Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 px-6 py-3 bg-[#3fbf81] text-white rounded-full hover:bg-[#36a973] transition cursor-pointer"
      >
        <HomeIcon className="w-5 h-5" />
        Go Home
      </button>
    </div>
  );
}
