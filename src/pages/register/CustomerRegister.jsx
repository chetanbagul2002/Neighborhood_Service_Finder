import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "react-modal"; // Import react-modal
import OtpVerificationModal from "../../components/modals/OtpVerificationModal"; // We will create this next

// Set app element for react-modal (important for accessibility and preventing body scroll)
Modal.setAppElement('#root'); // Ensure this matches the ID of your root HTML element

function CustomerRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "", // Corrected from 'number' to 'phone' to match backend DTO
    password: "", // Corrected from 'setpassword' to 'password'
    confirmPassword: "", // Corrected from 'confirmpassword'
    address: "" // Added address as per backend DTO
  });
  const [loading, setLoading] = useState(false);

  // State for OTP modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpUser, setOtpUser] = useState(null); // To store userId and mobileNumber for OTP modal

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic Frontend Validation (before sending to backend)
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirmPassword ||
      !form.address
    ) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }
    if (!validateEmail(form.email)) {
      toast.error("Invalid email format!");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      toast.warning("Password should be at least 6 characters!");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }
    if (!/^[0-9]{10}$/.test(form.phone)) {
        toast.error("Phone number must be 10 digits!");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/auth/register/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Customer registration failed.");
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
        password: "",
        confirmPassword: "",
        address: ""
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
    toast.success("Mobile number verified successfully! You can now log in.");
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
        <h2 className="text-3xl font-bold text-white text-center mb-6">Customer Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <InputField label="Full Name" icon={<User />} name="name" value={form.name}
            onChange={handleChange} placeholder="Your name" />
          {/* Email */}
          <InputField label="Email" icon={<Mail />} name="email" value={form.email}
            onChange={handleChange} placeholder="you@example.com" type="email" />
          {/* Phone */}
          <InputField label="Mobile No" icon={<Phone />} name="phone" value={form.phone} // Changed name to 'phone'
            onChange={handleChange} placeholder="Mobile No" type="number" />
          {/* Address */}
          <InputField label="Address" icon={<Mail />} name="address" value={form.address}
            onChange={handleChange} placeholder="Your Address" type="text" />
          {/* Password */}
          <InputField label="Set Password" icon={<Lock />} name="password" // Changed name to 'password'
            value={form.password} onChange={handleChange} placeholder="••••••••"
            type="password" />
          {/* Confirm Password */}
          <InputField label="Confirm Password" icon={<Lock />} name="confirmPassword" // Changed name to 'confirmPassword'
            value={form.confirmPassword} onChange={handleChange} placeholder="••••••••"
            type="password" />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-3 rounded-xl shadow-md"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
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
function InputField({ label, icon, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg border border-white/20">
        <span className="text-gray-400 mr-2">{icon}</span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="bg-transparent text-white w-full placeholder-gray-400 outline-none"
        />
      </div>
    </div>
  );
}

export default CustomerRegister;
