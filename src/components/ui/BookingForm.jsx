// BookingForm.jsx
import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Send, MessageCircle, Percent } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function BookingForm({ provider, onClose }) {
  const { user: authUser, token } = useAuth();
  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState(authUser?.address || "");
  const [message, setMessage] = useState("");
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setEmail(authUser.email || "");
      setAddress(authUser.address || "");
    }
  }, [authUser]);

  const handleBooking = async () => {
    // --- MODIFIED LOGIC START ---
    if (!authUser) {
      toast.error("You must be logged in to book a service.");
      return;
    }

    if (authUser.role !== "CUSTOMER") { // Check if the logged-in user is a CUSTOMER
      toast.error("Only customers can book services.");
      return;
    }

    if (!authUser.accountVerified) { // Check for account verification
      toast.error("Your account is not verified. Please verify your account to confirm a booking.");
      return;
    }
    // --- MODIFIED LOGIC END ---

    if (!date || !time || !message || !provider.id || !provider.serviceType) {
      toast.error("Please fill in all required fields (Date, Time, Description, and ensure Provider details are available).");
      return;
    }

    setLoading(true);
    try {
      const serviceRequestPayload = {
        providerId: provider.id,
        serviceType: provider.serviceType,
        description: message,
        serviceDate: date,
        serviceTime: time + ":00",
      };

      const response = await fetch("http://localhost:8081/api/customers/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(serviceRequestPayload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Service request failed. Please try again.");
      }

      toast.success("Service Request Submitted! Provider will review and respond soon.");
      console.log("Service request confirmed:", data);
      onClose();
    } catch (error) {
      console.error("Service request error:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!provider) return (
    <div className="text-center mt-8 text-gray-600">
      <p>No provider data available. Please select a provider to book a service.</p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto my-10 max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Book Service with {provider.name}</h2>
      <p className="text-indigo-600 text-lg text-center mb-6">{provider.serviceType}</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
            disabled
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
            disabled
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            <Calendar className="inline-block w-4 h-4 mr-2" />Preferred Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            <Clock className="inline-block w-4 h-4 mr-2" />Preferred Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            <MapPin className="inline-block w-4 h-4 mr-2" />Your Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your current address"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
            disabled
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Description of Service Needed</label>
          <textarea
            id="message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please provide a detailed description of the service you need..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="coupon" className="block text-sm font-medium text-gray-700">
            <Percent className="inline-block w-4 h-4 mr-2" />Coupon Code (Optional)
          </label>
          <input
            type="text"
            id="coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon code"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-indigo-50 rounded-md">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">Summary</h3>
        <ul className="text-gray-700 text-sm space-y-1">
          <li>
            <strong>Provider:</strong> {provider.name}
          </li>
          <li>
            <strong>Service:</strong> {provider.serviceType}
          </li>
          <li>
            <strong>Date:</strong> {date || "Not selected"}
          </li>
          <li>
            <strong>Time:</strong> {time || "Not selected"}
          </li>
        </ul>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleBooking}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 disabled:bg-gray-400"
          // --- MODIFIED DISABLED LOGIC START ---
          disabled={loading || !authUser || authUser.role !== "CUSTOMER" || !authUser.accountVerified}
          // --- MODIFIED DISABLED LOGIC END ---
        >
          {loading ? 'Confirming...' : <><Send className="w-5 h-5" /> Confirm Booking</>}
        </button>
      </div>

      {/* --- MODIFIED MESSAGES START --- */}
      {!authUser && (
        <p className="text-center text-red-500 text-sm mt-4">
          You must be logged in to confirm a booking.
        </p>
      )}
      {authUser && authUser.role !== "CUSTOMER" && (
        <p className="text-center text-red-500 text-sm mt-4">
          Only customers can book services. Please log in as a customer.
        </p>
      )}
      {authUser && authUser.role === "CUSTOMER" && !authUser.accountVerified && (
        <p className="text-center text-orange-500 text-sm mt-4">
          Your account is not verified. Please check your email to verify your account to confirm a booking.
        </p>
      )}
      {/* --- MODIFIED MESSAGES END --- */}
    </div>
  );
}

export default BookingForm;