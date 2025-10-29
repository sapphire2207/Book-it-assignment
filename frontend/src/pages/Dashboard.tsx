import React from "react";
import Navbar from "../components/Navbar";
import { useBooking } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { experiences, setSelectedExperience, loading, error, searchTerm } = useBooking();
  const navigate = useNavigate();

  const handleViewDetails = (exp: any) => {
    setSelectedExperience(exp);
    navigate(`/experience/${exp._id}`);
  };

  const filteredExperiences = React.useMemo(() => {
    return experiences.filter(
      (exp) =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [experiences, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-600">
        Loading experiences...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredExperiences.length > 0 ? (
            filteredExperiences.map((exp) => (
              <div
                key={exp._id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative h-48">
                  <img
                    loading="lazy"
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col grow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-black">{exp.title}</h3>
                    <span className="text-xs bg-[#d6d6d6] px-2 py-1 rounded text-black whitespace-nowrap ml-2">
                      {exp.location}
                    </span>
                  </div>

                  <p className="text-sm text-[#747474] mb-4 line-clamp-2 grow">
                    {exp.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-sm">
                      <span className="text-black">From </span>
                      <span className="text-lg font-semibold text-black">
                        ₹{exp.price}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(exp)}
                      className="bg-[#ffd643] text-black px-4 py-1.5 rounded text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No experiences found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;