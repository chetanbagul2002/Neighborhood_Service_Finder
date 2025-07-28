import { useState } from "react";
import { Calendar, Clock, MapPin, User, MessageCircle, Phone, Info } from "lucide-react";

function BookingDetailsModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Booking Details</h2>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="text-purple-600" size={18} />
            <span className="font-medium">{booking.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-purple-600" size={18} />
            {/* Changed from booking.date to booking.serviceDate */}
            <span>{booking.serviceDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-purple-600" size={18} />
            {/* Changed from booking.time to booking.serviceTime */}
            <span>{booking.serviceTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-purple-600" size={18} />
            {/* Assuming 'customerAddress' from backend maps to 'location' in frontend for display */}
            <span>{booking.customerAddress || booking.location || "N/A"}</span>
          </div>
          {booking.description && ( // Changed from booking.message to booking.description
            <p className="text-sm text-gray-600 italic">Note: {booking.description}</p>
          )}
          <div>
            <strong>Status:</strong>{" "}
            <span className={`inline-block px-2 py-1 text-xs rounded ${
              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
              booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
              booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
              booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {booking.status}
            </span>
          </div>

          {booking.price && (
            <div className="flex items-center gap-2">
              <Info className="text-purple-600" size={18} />
              <span>
                <strong>Price:</strong> ${booking.price.toFixed(2)}
              </span>
            </div>
          )}

          {booking.customerPhone && (
            <div className="flex items-center gap-2">
              <Phone className="text-purple-600" size={18} />
              <span>
                <strong>Customer Phone:</strong> {booking.customerPhone}
              </span>
            </div>
          )}

          {/* Provider Confirmation Status */}
          <div className="text-sm mt-3">
              <strong>Provider Confirmed Completion:</strong>{" "}
              <span className={`font-semibold ${booking.providerConfirmedCompletion ? 'text-green-600' : 'text-red-600'}`}>
                {booking.providerConfirmedCompletion ? 'Yes' : 'No'}
              </span>
            </div>

            {/* Customer Confirmation Status */}
            <div className="text-sm">
              <strong>Customer Confirmed Completion:</strong>{" "}
              <span className={`font-semibold ${booking.customerConfirmedCompletion ? 'text-green-600' : 'text-red-600'}`}>
                {booking.customerConfirmedCompletion ? 'Yes' : 'No'}
              </span>
            </div>

          {/* Add more details here as needed */}
        </div>
      </div>
    </div>
  );
}

export default BookingDetailsModal;