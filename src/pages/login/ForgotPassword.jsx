import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import bgImg from "../../assets/bg-login.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSendOtp = () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("OTP sent to your email");
    setOtpSent(true);
    setOtp("");
    startResendCooldown();
  };

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      toast.error("Enter the OTP");
      return;
    }
    toast.success("OTP verified! You can now reset your password.");
    navigate("/reset-password");
  };

  const startResendCooldown = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Forgot Password
        </h2>

        <div className="space-y-4">
          <label className="text-white block text-sm font-medium">Email</label>
          <div className="flex items-center px-4 py-2 rounded-lg bg-white/20 border border-white/30">
            <Mail className="mr-2 text-white" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-transparent outline-none placeholder-white/70 text-white"
            />
          </div>

          {otpSent && (
            <>
              <label className="text-white block text-sm font-medium">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white outline-none placeholder-white/70"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
              >
                Verify OTP
              </button>
              <button
                onClick={handleSendOtp}
                disabled={resendCooldown > 0}
                className={`w-full mt-2 py-2 rounded-xl font-medium transition ${resendCooldown > 0 ? 'bg-gray-300 text-gray-600' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </>
          )}

          {!otpSent && (
            <button
              onClick={handleSendOtp}
              className="w-full mt-4 bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
            >
              Send OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
