import React from "react";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

const Confirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const refId = location.state?.refId || "UNKNOWN";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-green-500 rounded-full w-20 h-20 flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            Booking Confirmed
          </h1>

          <p className="text-[#656565]">
            Ref ID: <span className="font-semibold">{refId}</span>
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-8 bg-[#e3e3e3] text-[#656565] px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default Confirmation;
