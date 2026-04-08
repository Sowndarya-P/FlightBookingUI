import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./Context/AuthContext";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import Search from "./Pages/Search";
import Booking from "./Pages/Booking";
import Ticket from "./Pages/Ticket";

// Redirects to /auth if user is not logged in
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
};

const AppRoutes = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search setSelection={setSelectedFlight} /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><Booking selectedFlight={selectedFlight} /></ProtectedRoute>} />
        <Route path="/ticket" element={<ProtectedRoute><Ticket /></ProtectedRoute>} />

        {/* Fallback: unknown routes redirect home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}