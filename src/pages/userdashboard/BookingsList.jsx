// pages/UserDashboard/BookingsList.jsx
import { useState } from 'react';
import ChatModal from "../../components/modals/ChatModal";
import { useAuth } from "../../context/AuthContext";
import { toast } from 'react-toastify';
// Import your new RatingModal component
import RatingModal from '../../components/modals/RatingModal'; // Assuming path to your new modal

export default function BookingsList({ bookings }) {
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedBookingForChat, setSelectedBookingForChat] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const { user: authUser, token } = useAuth();

  // New state for rating modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState(null);

  if (!bookings || bookings.length === 0) return <p className="bg-white p-6 rounded-2xl shadow-xl text-gray-500">No bookings yet.</p>;

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
      const displayHour = hour % 12 || 12; // Convert to 12-hour format
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      console.error("Error formatting time:", timeString, error);
      return 'N/A';
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const res = await fetch(`http://localhost:8081/api/customers/requests/cancel`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ serviceRequestId: bookingId }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to cancel booking');
        }

        toast.success("Booking cancelled successfully!");
        // You might need to update the bookings list here or refetch it
        // A prop like 'onBookingUpdate' could be passed from UserDashboard to refetch bookings.
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error(error.message || "Error cancelling booking.");
      }
    }
  };

  const handleChat = async (booking) => {
    // Logic to handle chat initiation, similar to your existing code
    if (!authUser || !authUser.userId || !token) {
        toast.error("Authentication required to chat.");
        return;
    }
    setSelectedBookingForChat(booking);
    try {
      // Fetch or create conversation ID
      const res = await fetch(`http://localhost:8081/api/messages/conversation?participant1Id=${authUser.userId}&participant2Id=${booking.providerId}`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      if (!res.ok) {
          throw new Error('Failed to fetch conversation');
      }
      const data = await res.json();
      setConversationId(data.id);
      setShowChatModal(true);
    } catch (error) {
        console.error("Error fetching conversation:", error);
        toast.error("Could not start chat. Please try again.");
    }
  };

  const closeChatModal = () => {
    setShowChatModal(false);
    setSelectedBookingForChat(null);
    setConversationId(null);
  };

  // New functions for rating modal
  const handleRateNow = (booking) => {
    setSelectedBookingForRating(booking);
    setShowRatingModal(true);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedBookingForRating(null);
    // Optionally, you might want to refresh the bookings list here
    // to reflect that a review has been left.
    // e.g., if you have an onBookingRated prop or can trigger a refetch in UserDashboard.
  };

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-2xl shadow-xl">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">My Bookings</h3>
      <div className="align-middle inline-block min-w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{b.serviceName}</div>
                  <div className="text-xs text-gray-500">{b.serviceDescription}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{b.providerName}</div>
                  <div className="text-xs text-gray-500">{b.providerEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatServiceDate(b.serviceDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatServiceTime(b.serviceTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${b.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' : ''}
                    ${b.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                    ${b.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {b.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                  {b.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleChat(b)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Chat
                    </button>
                  )}
                  {b.status === 'COMPLETED' && !b.hasRated && ( // Assuming 'hasRated' flag from backend
                    <button
                      onClick={() => handleRateNow(b)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded-md text-xs hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                      Rate Now
                    </button>
                  )}
                  {b.status === 'COMPLETED' && b.hasRated && (
                    <span className="text-gray-500 text-xs">Rated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showChatModal && selectedBookingForChat && conversationId && (
        <ChatModal
          conversationId={conversationId}
          currentUserId={authUser.userId}
          otherPartyId={selectedBookingForChat.providerId}
          currentUserName={authUser.name}
          otherPartyName={selectedBookingForChat.providerName}
          onClose={closeChatModal}
        />
      )}

      {showRatingModal && selectedBookingForRating && (
        <RatingModal
          booking={selectedBookingForRating}
          onClose={closeRatingModal}
          onRatingSubmitted={() => {
            closeRatingModal();
            // You might want to trigger a refresh of bookings here
            // For example, if UserDashboard passes a refreshBookings prop:
            // props.refreshBookings();
            toast.success("Thank you for your rating!");
          }}
        />
      )}
    </div>
  );
}