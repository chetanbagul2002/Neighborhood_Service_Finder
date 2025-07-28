import { Link, useNavigate } from "react-router-dom";
import { Menu, User, ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Import useAuth hook

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const { isAuthenticated, user, logout } = useAuth(); // Get auth state and functions from context
  const navigate = useNavigate(); // For programmatic navigation on logout

  // Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdown && !event.target.closest('.user-dropdown-container')) {
        setUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdown]);


  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          NeighborHelp
        </Link>
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
          <Link to="/services" className="text-gray-700 hover:text-indigo-600 font-medium">Services</Link>
          {/* Conditional rendering based on authentication status */}
          {isAuthenticated ? (
            <div className="relative user-dropdown-container"> {/* Add class for click outside */}
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center space-x-2"
              >
                {/* Use a placeholder image or actual user photo if available */}
                <img
                  src={user?.photoUrl || `https://www.gravatar.com/avatar/${user?.email ? encodeURIComponent(user.email) : '00000000000000000000000000000000'}?d=mp&s=40`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-gray-700">
                  {user?.name?.split(" ")[0] || user?.email?.split('@')[0] || "User"}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${userDropdown ? 'rotate-180' : ''}`} />
              </button>
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg py-2 z-50">
                  {user?.role === "CUSTOMER" && (
                    <Link to="/user-dashboard" className="block px-4 py-2 hover:bg-gray-100">
                      My Dashboard
                    </Link>
                  )}
                  {user?.role === "PROVIDER" && (
                    <Link to="/provider-dashboard" className="block px-4 py-2 hover:bg-gray-100">
                      My Dashboard
                    </Link>
                  )}
                   {user?.role === "ADMIN" && (
                    <Link to="/admin-dashboard" className="block px-4 py-2 hover:bg-gray-100">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // If not authenticated, show Login/Register links
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
        {/* Mobile Menu Icon */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 bg-white border-t space-y-3">
          <Link to="/" className="block text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/services" className="block text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>Services</Link>
          {isAuthenticated ? (
            <>
              {user?.role === "CUSTOMER" && (
                <Link to="/user-dashboard" className="block text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                  My Dashboard
                </Link>
              )}
              {user?.role === "PROVIDER" && (
                <Link to="/provider-dashboard" className="block text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                  My Dashboard
                </Link>
              )}
              {user?.role === "ADMIN" && (
                <Link to="/admin-dashboard" className="block text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              )}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left text-gray-700 hover:text-indigo-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
