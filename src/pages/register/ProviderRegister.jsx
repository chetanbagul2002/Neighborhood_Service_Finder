import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "react-modal";
import OtpVerificationModal from "../../components/modals/OtpVerificationModal"; // Import the reusable OTP modal

// Set app element for react-modal (important for accessibility)
Modal.setAppElement('#root');

function ProviderRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    aadhaarNumber: "",
    password: "",
    confirmPassword: "",
    address: "",
    serviceType: ""
  });
  const [loading, setLoading] = useState(false);

  // State for OTP modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpUser, setOtpUser] = useState(null); // To store userId and mobileNumber for OTP modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Special handling for Aadhaar to format it (optional, can be done fully on backend)
    if (name === "aadhaarNumber") {
      const formatted = value
        .replace(/\D/g, "") // Remove non-digits
        .slice(0, 12) // Limit to 12 digits
        .replace(/(\d{4})(?=\d)/g, "$1 "); // Add space after every 4 digits
      setForm({ ...form, [name]: formatted });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateEmail = (email) => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Frontend Validation
    const { name, email, phone, aadhaarNumber, password, confirmPassword, address, serviceType } = form;

    if (!name || !email || !phone || !aadhaarNumber || !password || !confirmPassword || !address || !serviceType) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format!");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      toast.warning("Password should be at least 6 characters!");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }
    // Updated Aadhaar regex to match backend logic and flexible formatting
    // Ensure this regex also matches the pattern with spaces
    // The backend pattern is: ^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$
    if (!/^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/.test(aadhaarNumber)) { // This now strictly checks for spaces
      toast.error("Aadhaar number must be 12 digits, format: XXXX XXXX XXXX");
      setLoading(false);
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Phone number must be 10 digits!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/auth/register/provider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          address,
          // CRITICAL FIX: Send aadhaarNumber WITH spaces, as backend expects them
          aadhaarNumber: aadhaarNumber, // Removed .replace(/\s/g, '')
          serviceType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If backend returns specific field errors, you can parse them here
        if (data && data.error) {
            throw new Error(data.error);
        } else if (data && typeof data === 'object') {
            // Attempt to parse validation errors if they are structured like a map
            const errors = Object.values(data).flat().join('; ');
            if (errors) {
                throw new Error(errors);
            }
        }
        throw new Error("Provider registration failed.");
      }

      toast.success(data.message || "Registration successful! Please verify your mobile number.");
      
      // Store userId and mobileNumber to pass to OTP modal
      setOtpUser({ userId: data.userId, mobileNumber: data.mobileNumber });
      setShowOtpModal(true); // Show OTP verification modal

      // Clear form after successful registration
      setForm({
        name: "",
        email: "",
        phone: "",
        aadhaarNumber: "",
        password: "",
        confirmPassword: "",
        address: "",
        serviceType: ""
      });

    } catch (error) {
      console.error("Registration error:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Callback function for when OTP verification is successfully completed
  const handleOtpSuccess = () => {
    setShowOtpModal(false); // Close OTP modal
    toast.info("Phone number verified! Your provider account is now awaiting admin approval. You will be notified when active.");
    navigate("/login"); // Redirect to login page
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent backdrop-blur-2xl opacity-30 pointer-events-none z-0"></div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl rounded-2xl p-10 shadow-[0_0_60px_rgba(255,255,255,0.05)] border border-white/10"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">Provider Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Full Name" icon={<User />} name="name" value={form.name}
            onChange={handleChange} placeholder="Your name" />
          <Input label="Email" icon={<Mail />} name="email" value={form.email}
            onChange={handleChange} type="email" placeholder="you@example.com" />
          <Input label="Mobile No" icon={<Phone />} name="phone" value={form.phone}
            onChange={handleChange} type="number" placeholder="Mobile No" />
          <Input label="Address" icon={<Mail />} name="address" value={form.address}
            onChange={handleChange} placeholder="Your Address" type="text" />
          <Input label="Aadhaar No" icon={<CreditCard />} name="aadhaarNumber" value={form.aadhaarNumber}
            onChange={handleChange} type="text" placeholder="XXXX XXXX XXXX" maxLength="14" />
          <Input label="Service Type" icon={<Mail />} name="serviceType" value={form.serviceType}
            onChange={handleChange} placeholder="e.g. Plumber, Electrician" type="text" />
          <Input label="Set Password" icon={<Lock />} name="password" value={form.password}
            onChange={handleChange} type="password" placeholder="••••••••" />
          <Input label="Confirm Password" icon={<Lock />} name="confirmPassword"
            value={form.confirmPassword} onChange={handleChange} type="password" placeholder="••••••••" />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-3 rounded-xl shadow-md"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="text-sm text-gray-400 text-center mt-6">
          Already have an account? {" "}
          <Link to="/login" className="text-purple-400 hover:underline font-medium">
            Login here
          </Link>
        </div>
      </motion.div>

      {/* OTP Verification Modal */}
      {showOtpModal && otpUser && (
        <OtpVerificationModal
          userId={otpUser.userId}
          mobileNumber={otpUser.mobileNumber}
          onClose={() => setShowOtpModal(false)}
          onSuccess={handleOtpSuccess}
        />
      )}
    </div>
  );
}

// InputField Component (ensure this is available in the same file or imported)
// Note: This is a placeholder for your existing `Input` component based on the PDF.
// If you have a shared `Input` component, please ensure it's imported correctly.
function Input({ label, icon, name, value, onChange, type = "text", placeholder, maxLength }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg border border-white/20">
        {icon && <span className="text-gray-400 mr-2">{icon}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          required
          maxLength={maxLength}
          className="bg-transparent text-white w-full placeholder-gray-400 outline-none"
        />
      </div>
    </div>
  );
}

export default ProviderRegister;
