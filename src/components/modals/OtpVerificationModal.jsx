import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

// Make sure to call Modal.setAppElement('#root') in your main index.js or App.jsx
// It's already in index.js for you.

function OtpVerificationModal({ userId, mobileNumber, onClose, onSuccess }) {
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Tracks if OTP was initially sent
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // Cooldown for resend OTP

  // Automatically request OTP when modal opens
  useEffect(() => {
    if (userId && mobileNumber && !otpSent) {
      handleRequestOtp();
    }
  }, [userId, mobileNumber, otpSent]);

  const startResendCooldown = () => {
    setResendCooldown(30); // 30 seconds cooldown
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/api/auth/public/otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, mobileNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP. Please try again.");
      }

      toast.success(data.message || "OTP sent successfully!");
      console.log("OTP for testing:", data.otpCodeForTesting); // For development/testing
      setOtpSent(true);
      startResendCooldown(); // Start cooldown after sending OTP

    } catch (error) {
      console.error("OTP request error:", error.message);
      toast.error(error.message);
      onClose(); // Close modal on critical error
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/api/auth/public/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, mobileNumber, otpCode: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed. Please try again.");
      }

      toast.success(data.message || "Mobile number verified successfully!");
      onSuccess(); // Call the parent's success handler
    } catch (error) {
      console.error("OTP verification error:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true} // Always open when rendered
      onRequestClose={onClose}
      className="bg-white rounded-xl p-6 max-w-md mx-auto mt-32 outline-none shadow-xl relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        aria-label="Close modal"
      >
        <X size={24} />
      </button>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Verify Your Mobile Number
      </h2>
      <p className="text-center text-gray-600 mb-6">
        An OTP has been sent to your mobile number: <strong>{mobileNumber}</strong>
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1" htmlFor="otp-input">
            Enter OTP
          </label>
          <input
            id="otp-input"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Allow only digits
            placeholder="6-digit OTP"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleVerifyOtp}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <button
          onClick={handleRequestOtp}
          className={`w-full py-2 rounded-lg font-medium transition ${
            resendCooldown > 0 || loading
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-indigo-500 text-white hover:bg-indigo-600'
          }`}
          disabled={resendCooldown > 0 || loading}
        >
          {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
        </button>
      </div>
    </Modal>
  );
}

export default OtpVerificationModal;
