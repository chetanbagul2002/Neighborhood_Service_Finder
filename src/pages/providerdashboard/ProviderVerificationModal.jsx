import { useState } from "react";

export default function ProviderVerificationModal({ isOpen, onClose, provider, setProvider }) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const aadhaarDigits = provider?.aadhaar?.replace(/\s/g, "") || "";

  // Send OTP
  const sendOtp = () => {
    setError("");
    if (!/^\d{12}$/.test(aadhaarDigits)) {
      setError("Invalid Aadhaar number format.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      alert(`OTP sent to registered mobile for Aadhaar ${provider.aadhaar}`);
    }, 1000);
  };

  // Verify OTP
  const verifyOtp = () => {
    setError("");
    if (otp === "123456") {
      setProvider((prev) => ({
        ...prev,
        verified: true, // ✅ Merge instead of overwrite
      }));
      onClose();
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h3 className="text-xl font-semibold mb-4">Aadhaar Verification</h3>

        <button
          onClick={() => {
            setOtpSent(false);
            setOtp("");
            setError("");
            onClose();
          }}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <p className="mb-4">
          Aadhaar Number: <strong>{provider.aadhaar}</strong>
        </p>

        {!otpSent ? (
          <button
            onClick={sendOtp}
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <>
            <label className="block mb-2 font-semibold" htmlFor="otp">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
              placeholder="6-digit OTP"
            />
            {error && <p className="text-red-600 mb-2">{error}</p>}

            <button
              onClick={verifyOtp}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              Verify OTP
            </button>

            <button
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setError("");
              }}
              className="w-full mt-2 text-center text-purple-600 underline hover:text-purple-800"
            >
              Resend OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
