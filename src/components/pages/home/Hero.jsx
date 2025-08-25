// Hero Component
import React from "react";
import { Link } from "react-router-dom"; 
import { useSelector } from "react-redux"; //  auth state lene ke liye
import bannerImage from "../../../assets/bannerImageHome.png";

const Hero = () => {
  //  Redux se auth state (apne slice me jo rakha hai uske hisaab se change kar le)
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="px-4 sm:px-6 lg:px-5 sm:pt-8">
      <div className="layout-content-container flex flex-col max-w-6xl mx-auto">
        <div className="@container">
          <div className="w-full">
            <div
              className="flex min-h-[480px] md:min-h-[520px] flex-col gap-6 bg-center bg-no-repeat rounded-2xl items-center justify-center p-6 sm:p-8 text-center"
              style={{
                backgroundColor: "rgb(57, 167, 158)",
                backgroundImage: `url(${bannerImage})`,
              }}
            >
              <div className="flex flex-col gap-4 max-w-3xl">
                <h1 className="text-white text-3xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-tighter mt-40">
                  Your AI-Powered Healthcare Companion
                </h1>
                <h2 className="text-white/90 text-base sm:text-lg lg:text-xl font-normal max-w-2xl mx-auto">
                  AveryCare provides supportive, AI-driven phone calls to help you manage your health and well-being. Schedule and conduct calls with ease.
                </h2>
              </div>

              {/*   Buttons with navigation */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center">
                {/*   Get Started -> Sign Up page */}
                {/* {!isAuthenticated && ( */}
                  <Link 
                    to="/signup"
                    className="flex min-w-[120px] items-center justify-center rounded-full h-12 px-6 bg-[#3fbf81] text-[#101815] text-base font-bold hover:bg-[#34a06c] transition-transform transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                {/* )} */}

                {/*   Conditionally show Sign In / Dashboard */}
                {isAuthenticated ? (
                  <Link 
                    to="/schedule"
                    className="flex min-w-[120px] items-center justify-center rounded-full h-12 px-6 bg-[#eaf1ed] text-[#101815] text-base font-bold hover:bg-gray-200 transition-transform transform hover:scale-105"
                  >
                    Schedule Call
                  </Link>
                ) : (
                  <Link 
                    to="/login"
                    className="flex min-w-[120px] items-center justify-center rounded-full h-12 px-6 bg-[#eaf1ed] text-[#101815] text-base font-bold hover:bg-gray-200 transition-transform transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
