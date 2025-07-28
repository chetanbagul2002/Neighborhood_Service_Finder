// src/components/modals/RatingModal.jsx
import React, { useState } from 'react';
import { Star } from 'lucide-react'; // Assuming you have lucide-react for icons
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function RatingModal({ booking, onClose, onRatingSubmitted }) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, user: authUser } = useAuth();

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (score === 0) {
      toast.error('Please select a star rating.');
      return;
    }
    if (!comment.trim()) {
        toast.error('Please provide a comment for your review.');
        return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        serviceRequestId: booking.id,
        score: score,
        comment: comment,
      };

      const res = await fetch('http://localhost:8081/api/customers/ratings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit rating.');
      }

      const responseData = await res.json();
      toast.success(responseData.message || 'Rating submitted successfully!');
      onRatingSubmitted(); // Call the callback to close modal and refresh (if needed)
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(error.message || 'An error occurred while submitting your rating.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Rate Your Service</h2>
        <p className="mb-4 text-gray-700">Service: {booking.serviceName} with {booking.providerName}</p>

        <form onSubmit={handleSubmitRating}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Your Rating:
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`cursor-pointer ${
                    star <= score ? 'text-yellow-500 fill-current' : 'text-gray-300'
                  }`}
                  size={28}
                  onClick={() => setScore(star)}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">
              Your Review:
            </label>
            <textarea
              id="comment"
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}