import React from "react";
import { useBooking } from "../context/BookingContext";
import highwayLogo from "../assets/highway-delite.jpeg";

const Navbar: React.FC = () => {
  const { searchTerm, setSearchTerm } = useBooking();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section - Logo & Title */}
        <div className="flex items-center">
          <img
            src={highwayLogo}
            alt="Highway Delite Logo"
            className="w-12 h-12 object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-black">highway</span>
            <span className="text-base font-semibold text-black">delite</span>
          </div>
        </div>

        {/* Right Section - Search */}
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="Search experiences"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="hidden sm:block w-48 md:w-64 px-4 py-2 bg-[#ededed] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button className="bg-[#ffd643] hover:bg-[#ffcc00] text-black px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-colors">
            Search
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
