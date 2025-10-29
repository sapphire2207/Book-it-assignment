import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useBooking } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SelectDetails: React.FC = () => {
  const {
    selectedExperience,
    bookingDetails,
    setBookingDetails,
    refreshExperiences,
  } = useBooking();
  const [quantity, setQuantity] = useState(bookingDetails.quantity);
  const [selectedDate, setSelectedDate] = useState(bookingDetails.date);
  const [selectedTime, setSelectedTime] = useState(bookingDetails.time);
  const navigate = useNavigate();

  const slots = selectedExperience?.slots || [];
  const dates = Array.from(new Set(slots.map((slot) => slot.date)));

  useEffect(() => {
    if (dates.length > 0 && !selectedDate) setSelectedDate(dates[0]);
  }, [dates, selectedDate]);

  useEffect(() => {
    const slotCheck = slots.find(
      (s) => s.date === selectedDate && s.time === selectedTime
    );
    if (!slotCheck || slotCheck.isBooked) setSelectedTime("");
  }, [selectedDate, slots]);

  const timesForSelectedDate = slots
  .filter((slot) => slot.date === selectedDate)
  .map((slot) => ({
    time: slot.time,
    available: Math.max(slot.capacity - slot.bookedCount, 0),
  }));

  const basePrice = selectedExperience?.price || 999;
  const taxes = 59;
  const subtotal = basePrice * quantity;
  const total = subtotal + taxes;

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1) setQuantity(newQty);
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot before confirming.");
      return;
    }

    setBookingDetails({
      ...bookingDetails,
      experience: selectedExperience?.title || "Experience",
      date: selectedDate,
      time: selectedTime,
      quantity,
      subtotal,
      taxes,
      total,
    });

    await refreshExperiences();
    navigate("/checkout");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (!selectedExperience) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No experience selected.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div onClick={() => navigate(-1)} className="py-2 flex gap-2 items-center">
          <ArrowLeft className="h-5 w-5 text-gray-800" strokeWidth={2.5} />
          <span className="text-lg font-medium text-gray-900"> Details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src={selectedExperience?.image}
                alt={selectedExperience?.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                {selectedExperience?.title}
              </h1>
              <p className="text-[#6c6c6c] text-md leading-relaxed">
                {selectedExperience?.description}
              </p>

              {/* Choose date */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose date</h2>
                <div className="flex flex-wrap gap-2">
                  {dates.length > 0 ? (
                    dates.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                          selectedDate === date
                            ? "bg-[#ffd643] text-black"
                            : "bg-white text-[#838383] border-2 border-[#bdbdbd]"
                        }`}
                      >
                        {formatDate(date)}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-[#838383]">No available dates</p>
                  )}
                </div>
              </div>

              {/* Choose time */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-black mb-4">Choose time</h2>
                <div className="flex flex-wrap gap-2">
                  {timesForSelectedDate.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available > 0 && setSelectedTime(slot.time)}
                      disabled={slot.available === 0}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors relative ${
                        selectedTime === slot.time
                          ? "bg-yellow-400 text-black"
                          : slot.available === 0
                          ? "bg-[#cccccc] text-[#838383] cursor-not-allowed border-2 border-[#bdbdbd]"
                          : "bg-white text-[#838383] border-2 border-[#bdbdbd]"
                      }`}
                    >
                      {slot.time}
                      {slot.available > 0 ? (
                        <span className="ml-2 text-xs text-[#ff4c0a]">
                          {slot.available} left
                        </span>
                      ) : (
                        <span className="ml-2 text-xs text-[#6a6a6a]">Sold out</span>
                      )}
                    </button>
                  ))}
                </div>

                <p className="pt-3 text-[#838383]">All times are in IST (GMT + 5:30)</p>

                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
                  <p className="text-sm text-[#838383] bg-[#eeeeee] p-4 rounded">
                    Scenic routes, trained guides, and safety briefing. Minimum age 10.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#efefef] rounded-lg shadow-sm p-6 sticky top-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#656565] text-md">Starts at</span>
                  <span className="text-xl font-semibold text-gray-900">₹{basePrice}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#656565]">Quantity</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-6 h-6 border-2 border-[#c9c9c9] flex items-center justify-center text-black"
                    >
                      <span className="text-xl">−</span>
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-6 h-6 border-2 border-[#c9c9c9] flex items-center justify-center text-black"
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#656565]">Subtotal</span>
                    <span className="font-semibold text-black">₹{subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#656565]">Taxes</span>
                    <span className="font-semibold text-black">₹{taxes}</span>
                  </div>
                </div>

                <div className="border-t-2 border-[#d9d9d9] pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-semibold text-gray-900">₹{total}</span>
                  </div>
                  <button
                    onClick={handleConfirm}
                    className="w-full bg-[#ffd643] text-black py-3 rounded-md text-sm font-medium transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SelectDetails;