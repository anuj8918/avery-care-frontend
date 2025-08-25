import React from "react";

const Footer = () => {
  return (
    <footer className="min-w-full flex justify-center">
      <div className="w-full max-w-6xl px-6 py-8 mx-auto">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6">
          <a className="text-[#101815] hover:text-[#3fbf81] transition text-sm font-medium" href="#">Contact Us</a>
          <a className="text-[#101815] hover:text-[#3fbf81] transition text-sm font-medium" href="#">About Us</a>
          <a className="text-[#101815] hover:text-[#3fbf81] transition text-sm font-medium" href="#">Services</a>
          <a className="text-[#101815] hover:text-[#3fbf81] transition text-sm font-medium" href="#">Terms of Service</a>
          <a className="text-[#101815] hover:text-[#3fbf81] transition text-sm font-medium" href="#">Privacy Policy</a>
        </div>
        <p className="text-[#101815] text-sm text-center">
          © {new Date().getFullYear()} AveryCare. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
