import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useBooking } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Checkout: React.FC = () => {
  const { bookingDetails, userInfo, setUserInfo, selectedExperience, setBookingDetails, refreshExperiences } = useBooking();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");

  const handleApplyPromo = async () => {
    if (!userInfo.promoCode) {
      setError("Please enter a promo code.");
      return;
    }

    setPromoLoading(true);
    setError("");
    setPromoMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/promo/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: userInfo.promoCode }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        throw new Error(data.message || "Invalid promo code");
      }

      const { discountType, amount } = data;

      const subtotalWithTax = bookingDetails.subtotal + bookingDetails.taxes;
      let finalTotal = subtotalWithTax;

      if (discountType === "percent") {
        finalTotal = subtotalWithTax - (subtotalWithTax * amount) / 100;
        setPromoMessage(`Promo applied! You saved ${amount}% 🎉`);
      } else if (discountType === "flat") {
        finalTotal = Math.max(0, subtotalWithTax - amount);
        setPromoMessage(`Promo applied! You saved ₹${amount} 🎉`);
      }

      setBookingDetails({
        ...bookingDetails,
        total: finalTotal,
      });
    } catch (err: any) {
      setError(err.message || "Failed to apply promo code.");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!userInfo.fullName || !userInfo.email || !userInfo.agreedToTerms) {
      setError("Please fill all details and agree to terms before confirming.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userInfo.fullName,
          email: userInfo.email,
          promoCode: userInfo.promoCode,
          experienceId: selectedExperience?._id,
          slot: {
            date: bookingDetails.date,
            time: bookingDetails.time,
          },
          totalPrice: bookingDetails.total,
        }),
      });

      await refreshExperiences();

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      console.log("✅ Booking confirmed:", data);
      navigate("/confirmation", { state: { refId: data.booking.refId } });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div onClick={() => navigate(-1)} className="py-2 flex gap-2 items-center">
          <ArrowLeft className="h-5 w-5 text-gray-800" strokeWidth={2.5} />
          <span className="text-lg font-medium text-gray-900"> Checkout</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2">
            <div className="bg-[#efefef] rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#5b5b5b] mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={userInfo.fullName}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, fullName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-[#dddddd] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd643]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5b5b5b] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Your email"
                    value={userInfo.email}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-[#dddddd] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd643]"
                  />
                </div>
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={userInfo.promoCode}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, promoCode: e.target.value })
                  }
                  className="flex-1 px-4 py-2.5 bg-[#dddddd] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd643]"
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={promoLoading}
                  className={`bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    promoLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
                  }`}
                >
                  {promoLoading ? "Checking..." : "Apply"}
                </button>
              </div>

              {promoMessage && <p className="text-green-600 text-sm mb-2">{promoMessage}</p>}
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  color="black"
                  checked={userInfo.agreedToTerms}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, agreedToTerms: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-gray-400 text-black focus:ring-black accent-black"
                />
                <span className="text-sm text-[#5b5b5b]">
                  I agree to the terms and safety policy
                </span>
              </label>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-1">
            <div className="bg-[#efefef] rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#656565]">Experience</span>
                  <span className="font-semibold text-black">
                    {bookingDetails.experience}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#656565]">Date</span>
                  <span className="font-semibold text-gray-900">
                    {bookingDetails.date}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#656565]">Time</span>
                  <span className="font-semibold text-gray-900">
                    {bookingDetails.time}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#656565]">Qty</span>
                  <span className="font-semibold text-gray-900">
                    {bookingDetails.quantity}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#656565]">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ₹{bookingDetails.subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#656565]">Taxes</span>
                    <span className="font-semibold text-gray-900">
                      ₹{bookingDetails.taxes}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#d9d9d9] pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{bookingDetails.total}
                    </span>
                  </div>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className={`w-full py-3 rounded-md text-sm font-medium transition-colors ${
                      loading
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-[#ffd643] text-black"
                    }`}
                  >
                    {loading ? "Processing..." : "Pay and Confirm"}
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

export default Checkout;