import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import { toast } from 'react-toastify'; // Import toast for notifications

function CustomerLogin() {
    const navigate = useNavigate();
    const { login } = useAuth(); // Get the login function from AuthContext
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

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

        // Frontend validation
        if (!form.email || !form.password) {
            toast.error("Email and password are required.");
            setLoading(false);
            return;
        }
        if (!validateEmail(form.email)) {
            toast.error("Invalid email format.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();
            console.log("Login successful (backend response):", data); // This log is good

            if (!response.ok) {
                // Handle backend errors
                const errorMessage = data.error || data.message || "Login failed. Please check your credentials.";
                throw new Error(errorMessage);
            }

            // Call the login function from AuthContext to store token and user info
            login(data.token, data); // Pass the entire user object received from backend

            toast.success(data.message || "Login successful!");

            // CRITICAL FIX: Role-based redirection
            if (data.role === 'CUSTOMER') {
                navigate('/user-dashboard');
            } else if (data.role === 'PROVIDER') {
                navigate('/provider-dashboard');
            } else if (data.role === 'ADMIN') {
                navigate('/admin-dashboard'); // Assuming you have an admin dashboard route
            } else {
                navigate('/'); // Default fallback, maybe landing page
            }

        } catch (error) {
            console.error("Login error:", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderInputField = (label, icon, name, type = 'text') => (
        <div>
            <label className="block text-sm text-gray-300 mb-1">{label}</label>
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                {icon && <span className="text-gray-400 mr-2">{icon}</span>}
                <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={label}
                    required
                    className="bg-transparent text-white w-full placeholder-gray-400 outline-none"
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent backdrop-blur-2xl opacity-30 pointer-events-none z-0"></div>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl rounded-2xl p-10 shadow-[0_0_60px_rgba(255,255,255,0.05)] border border-white/10"
            >
                <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {renderInputField('Email', <Mail />, 'email', 'email')}
                    {renderInputField('Password', <Lock />, 'password', 'password')}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 rounded-xl shadow-md"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="text-sm text-gray-400 text-center mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-400 hover:underline font-medium">
                        Register here
                    </Link>
                </div>
                <div className="text-sm text-gray-400 text-center mt-3">
                    <Link to="/forgot-password" className="text-indigo-400 hover:underline font-medium">
                        Forgot Password?
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default CustomerLogin;
