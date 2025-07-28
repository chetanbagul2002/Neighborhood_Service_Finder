// pages/ProviderDashboard/ProviderBookings.jsx
import React, { useState } from "react";
import { Calendar, Clock, MapPin, User, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import ChatModal from "../../components/modals/ChatModal";

export default function ProviderBookings({ bookings, setBookings }) {
  const { token, user: authUser } = useAuth();
  const [loadingId, setLoadingId] = useState(null);
  const [selectedBookingForChat, setSelectedBookingForChat] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);

  const updateBookingStatus = async (bookingId, newStatus) => {
    setLoadingId(bookingId);
    try {
      const res = await fetch(`http://localhost:8081/api/provider/requests/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          serviceRequestId: bookingId,
          newStatus: newStatus
        })
      });
      if (!res.ok) {
        throw new Error("Failed to update booking");
      }
      const updatedBooking = await res.json();
      setBookings(prev => prev.map(b => (b.id === updatedBooking.id ? updatedBooking : b)));
      toast.success(`Booking ${bookingId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error(error.message || "Failed to update booking status.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleChatClick = async (booking) => {
    setSelectedBookingForChat(booking);
    try {
      // Corrected URL: explicitly use localhost and port 8081
      const response = await fetch(`http://localhost:8081/api/provider/conversations/start/${booking.customerId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to start or retrieve conversation.");
      }
      const data = await response.json();
      setConversationId(data.id);
      setShowChatModal(true);
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error(`Failed to start chat: ${error.message}`);
    }
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setSelectedBookingForChat(null);
    setConversationId(null);
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-xl text-gray-500">
        No bookings assigned to you yet.
      </div>
    );
  }

  const formatServiceDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return 'N/A';
    }
  };

  const formatServiceTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      console.error("Error formatting time:", timeString, error);
      return 'N/A';
    }
  };

  return (
    <div className="space-y-4">
      {bookings.map((b) => {
        const isPending = (b.status || "").toUpperCase() === "PENDING";
        const isAccepted = (b.status || "").toUpperCase() === "ACCEPTED";
        return (
          <div
            key={b.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                Service: {b.serviceName}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <User size={16} /> Customer: {b.customerName}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin size={16} /> Location: {b.serviceLocation}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar size={16} /> Date: {formatServiceDate(b.serviceDate)}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Clock size={16} /> Time: {formatServiceTime(b.serviceTime)}
              </p>
              <p className={`text-sm font-medium mt-1 ${isPending ? "text-yellow-600" : isAccepted ? "text-green-600" : "text-gray-500"}`}>
                Status: {b.status}
              </p>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-0">
              {isPending && (
                <>
                  <button
                    onClick={() => updateBookingStatus(b.id, "ACCEPTED")}
                    className="bg-green-500 text-white px-3 py-1 rounded-md text-xs hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    disabled={loadingId === b.id}
                  >
                    {loadingId === b.id ? "Updating..." : "Accept"}
                  </button>
                  <button
                    onClick={() => updateBookingStatus(b.id, "REJECTED")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    disabled={loadingId === b.id}
                  >
                    {loadingId === b.id ? "Updating..." : "Reject"}
                  </button>
                </>
              )}
              {isAccepted && (
                <>
                  <button
                    onClick={() => updateBookingStatus(b.id, "COMPLETED")}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                    disabled={loadingId === b.id}
                  >
                    {loadingId === b.id ? "Updating..." : "Complete"}
                  </button>
                  <button
                    onClick={() => handleChatClick(b)}
                    className="bg-purple-600 text-white px-2 py-1 rounded"
                  >
                    Chat
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      {showChatModal && selectedBookingForChat && conversationId && (
        <ChatModal
          conversationId={conversationId}
          currentUserId={authUser.userId}
          otherPartyId={selectedBookingForChat.customerId}
          currentUserName={authUser.name}
          otherPartyName={selectedBookingForChat.customerName}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}