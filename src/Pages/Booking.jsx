import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Booking = ({ selectedFlight }) => {
  const navigate = useNavigate();

  const [passenger, setPassenger] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    countryCode: "+91",
    phone: "",
    passport: "",
    aadhar: "",
    nationality: "",
    seat: "",
    meal: "",
    baggage: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPassenger({ ...passenger, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Merge passenger form data + flight details into one object for Ticket page
    const ticketData = {
      ...passenger,
      from: selectedFlight?.from || "N/A",
      to: selectedFlight?.to || "N/A",
      date: selectedFlight?.date || "N/A",
      airline: selectedFlight?.airline || "N/A",
      flightNumber: selectedFlight?.flightNumber || "N/A",
      departure: selectedFlight?.departure || "N/A",
      arrival: selectedFlight?.arrival || "N/A",
      duration: selectedFlight?.duration || "N/A",
      price: selectedFlight?.price || "N/A",
      stops: selectedFlight?.stops ?? "N/A",
      cabin: selectedFlight?.cabin || "Economy",
      aircraft: selectedFlight?.aircraft || "N/A",
      includedBaggage: selectedFlight?.baggage || "15kg",
    };

    navigate("/ticket", { state: ticketData });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6 relative"
      style={{
        background: "linear-gradient(135deg, #020818 0%, #0a1628 30%, #0d2444 60%, #0a3060 100%)"
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative backdrop-blur-lg bg-white/90 p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 font-semibold hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-blue-800 text-center">
          Passenger Booking
        </h1>
        <p className="text-gray-500 text-center mb-2">
          Fill passenger details to confirm your ticket
        </p>

        {/* Flight Summary Banner */}
        {selectedFlight && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-bold text-blue-800 text-base">
                  {selectedFlight.from} → {selectedFlight.to}
                </span>
                <span className="ml-3 text-gray-500">{selectedFlight.date}</span>
              </div>
              <div className="text-gray-600">
                <span className="font-semibold">{selectedFlight.airline}</span>
                {" · "}
                <span>{selectedFlight.flightNumber}</span>
                {" · "}
                <span>{selectedFlight.departure} – {selectedFlight.arrival}</span>
              </div>
              <div className="text-blue-900 font-black text-lg">
                ₹{selectedFlight.price?.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {!selectedFlight && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 mb-6 text-sm text-yellow-800 text-center">
            ⚠️ No flight selected. Please{" "}
            <button
              className="underline font-semibold"
              onClick={() => navigate("/search")}
            >
              go back and choose a flight
            </button>
            .
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Passenger Info */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text" name="name" placeholder="Full Name"
              value={passenger.name} onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required
            />
            <input
              type="number" name="age" placeholder="Age" min="1" max="120"
              value={passenger.age} onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required
            />
            <select name="gender" value={passenger.gender} onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required>
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <select name="nationality" value={passenger.nationality} onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required>
              <option value="">Nationality</option>
              <option>Indian</option>
              <option>American</option>
              <option>British</option>
              <option>Canadian</option>
              <option>Australian</option>
            </select>
            <input
              type="email" name="email" placeholder="Email Address"
              value={passenger.email} onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required
            />
            <input
              type="text" name="passport" placeholder="Passport Number (optional)"
              value={passenger.passport} onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text" name="aadhar" placeholder="Aadhaar Number (optional)"
              value={passenger.aadhar} onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Phone */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <select name="countryCode" value={passenger.countryCode} onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="+91">+91 India</option>
              <option value="+1">+1 USA</option>
              <option value="+44">+44 UK</option>
              <option value="+61">+61 Australia</option>
            </select>
            <input
              type="tel" name="phone" placeholder="Phone Number"
              value={passenger.phone} onChange={handleChange}
              className="border p-3 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required
            />
          </div>

          {/* Travel Preferences */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <select name="seat" value={passenger.seat} onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Seat Preference</option>
              <option>Window</option>
              <option>Aisle</option>
              <option>Middle</option>
            </select>
            <select name="meal" value={passenger.meal} onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Meal Preference</option>
              <option>Veg</option>
              <option>Non Veg</option>
              <option>No Meal</option>
            </select>
            <select name="baggage" value={passenger.baggage} onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Extra Baggage</option>
              <option>None</option>
              <option>+10kg</option>
              <option>+20kg</option>
            </select>
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 mt-5 text-sm cursor-pointer">
            <input type="checkbox" name="agree" checked={passenger.agree} onChange={handleChange} required />
            I agree to the airline terms &amp; conditions
          </label>

          {/* Submit */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={!passenger.agree}
              className="bg-blue-600 text-white px-10 py-3 rounded-full font-semibold shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;

