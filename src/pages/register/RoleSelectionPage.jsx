import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Briefcase } from "lucide-react"; // Import icons

function RoleSelectionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-blue-800 to-purple-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/20 text-center max-w-2xl w-full"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 leading-tight">
          Join NeighborHelp
        </h1>
        <p className="text-lg text-white/90 mb-10 max-w-prose mx-auto">
          Choose your path to connect with your community. Are you looking for services or offering them?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/20 p-8 rounded-2xl shadow-lg border border-white/30 flex flex-col items-center justify-center transition duration-300 transform"
          >
            <User className="w-16 h-16 text-indigo-300 mb-4" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-white mb-4">I need a service</h2>
            <p className="text-white/80 mb-6">
              Find reliable plumbers, electricians, cleaners, and more in your local area.
            </p>
            <Link
              to="/register/customer"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition duration-300"
            >
              Register as Customer
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/20 p-8 rounded-2xl shadow-lg border border-white/30 flex flex-col items-center justify-center transition duration-300 transform"
          >
            <Briefcase className="w-16 h-16 text-purple-300 mb-4" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-white mb-4">I offer a service</h2>
            <p className="text-white/80 mb-6">
              Join our network of professionals and connect with new clients seeking your expertise.
            </p>
            <Link
              to="/register/provider"
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition duration-300"
            >
              Register as Professional
            </Link>
          </motion.div>
        </div>

        <p className="text-md text-white/70 mt-10">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-bold hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default RoleSelectionPage;
