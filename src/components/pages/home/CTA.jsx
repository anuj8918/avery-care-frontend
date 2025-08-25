import React from "react";
import { Link } from "react-router-dom"; //   navigation ke liye import

const CTA = () => {
  return (
    <section className="flex justify-center py-12 sm:py-12 md:py-12">
      <div className="w-full max-w-4xl flex flex-col justify-center items-center gap-6 px-4 text-center">
        <h1 className="text-[#101815] text-3xl sm:text-4xl font-bold leading-tight">
          Ready to experience the future of healthcare?
        </h1>
        <p className="text-[#101815] text-base sm:text-lg font-normal max-w-2xl">
          Join AveryCare today and take control of your health and well-being.
        </p>

        {/*   Button with Link */}
        <div className="flex justify-center mt-4">
          <Link 
            to="/signup" 
            className="flex min-w-[120px] items-center justify-center rounded-full h-12 px-6 bg-[#3fbf81] text-[#101815] text-base font-bold hover:bg-[#34a06c] transition-transform transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
