import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";


const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passenger = location.state;

  // useState so bookingId doesn't regenerate on every render
  const [bookingId] = useState(() =>
    Math.floor(100000 + Math.random() * 900000)
  );
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });

  const ticketRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: ticketRef,
    documentTitle: `SkyEase_Ticket_${bookingId}`,
  });

  const formatDuration = (mins) => {
    if (!mins || isNaN(mins)) return "N/A";
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #020818 0%, #0a1628 30%, #0d2444 60%, #0a3060 100%)"
      }}
    >
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-3xl">

        {/* PRINTABLE TICKET AREA */}
        <div ref={ticketRef} className="p-2">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-800">SKYEASE</h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest">E-Ticket / Boarding Pass</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Booking Date</p>
              <p className="font-bold text-gray-700">{today}</p>
              <p className="text-xs text-gray-400 mt-1">Booking ID</p>
              <p className="font-black text-blue-700 text-lg">#{bookingId}</p>
            </div>
          </div>

          {passenger ? (
            <>
              {/* Flight Route Banner */}
              <div className="bg-blue-700 text-white rounded-xl p-5 mb-6 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-3xl font-black">{passenger.departure}</p>
                  <p className="text-sm font-bold mt-1">{passenger.from}</p>
                </div>
                <div className="flex-1 text-center px-4">
                  <p className="text-xs opacity-70 mb-1">{formatDuration(passenger.duration)}</p>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-[1px] bg-white/40"></div>
                    <span className="text-lg">✈️</span>
                    <div className="flex-1 h-[1px] bg-white/40"></div>
                  </div>
                  <p className="text-xs opacity-70 mt-1">
                    {passenger.stops === 0 ? "Non-stop" : "1 Stop"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black">{passenger.arrival}</p>
                  <p className="text-sm font-bold mt-1">{passenger.to}</p>
                </div>
              </div>

              {/* Flight Details + Passenger Details Side by Side */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                    Flight Details
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Airline</span>
                      <span className="font-semibold">{passenger.airline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Flight No.</span>
                      <span className="font-semibold">{passenger.flightNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date</span>
                      <span className="font-semibold">{passenger.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Aircraft</span>
                      <span className="font-semibold">{passenger.aircraft}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cabin</span>
                      <span className="font-semibold">{passenger.cabin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Included Baggage</span>
                      <span className="font-semibold">{passenger.includedBaggage}</span>
                    </div>
                    {passenger.baggage && passenger.baggage !== "None" && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Extra Baggage</span>
                        <span className="font-semibold text-blue-600">{passenger.baggage}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                    Passenger Details
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name</span>
                      <span className="font-semibold">{passenger.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age / Gender</span>
                      <span className="font-semibold">{passenger.age} / {passenger.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nationality</span>
                      <span className="font-semibold">{passenger.nationality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone</span>
                      <span className="font-semibold">{passenger.countryCode} {passenger.phone}</span>
                    </div>
                    {passenger.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email</span>
                        <span className="font-semibold text-xs">{passenger.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Seat</span>
                      <span className="font-semibold">{passenger.seat || "Auto Assigned"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Meal</span>
                      <span className="font-semibold">{passenger.meal || "Standard"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price + Status */}
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4">
                <div>
                  <p className="text-green-700 font-bold text-lg"> Booking Confirmed</p>
                  <p className="text-xs text-gray-500 mt-1">Show this ticket at the airport check-in counter</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total Fare</p>
                  <p className="text-3xl font-black text-blue-900">
                    ₹{typeof passenger.price === "number" ? passenger.price.toLocaleString() : passenger.price}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-red-500 py-10">
              No booking data found. Please complete a booking first.
            </p>
          )}
        </div>

        {/* Action Buttons — outside printable area */}
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={handlePrint}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
             Download Ticket
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
             Home
          </button>
          <button
            onClick={() => navigate("/search")}
            className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
             Book Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ticket;