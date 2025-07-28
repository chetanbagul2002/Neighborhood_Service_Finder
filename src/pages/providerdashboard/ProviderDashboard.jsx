// ProviderDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import ProviderProfile from "./ProviderProfile";
import ProviderBookings from "./ProviderBookings";
import ProviderSettings from "./ProviderSettings";
import Navbar from "../../components/ui/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function ProviderDashboard() {
  const { user: authUser, token, isAuthenticated, isAuthReady, logout, updateUser } = useAuth();
  const [providerProfile, setProviderProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Memoize fetchProviderProfile and fetchProviderBookings
  // Ensure that these functions themselves do not trigger endless re-renders
  const fetchProviderProfile = useCallback(async () => {
    if (!authUser || !authUser.userId || !token) {
      console.warn("ProviderDashboard: Cannot fetch profile. Auth user or token missing.");
      return null; // Return null if conditions are not met
    }

    try {
      const res = await fetch(`http://localhost:8081/api/provider/${authUser.userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to load provider profile: ${errorText}`);
      }
      const data = await res.json();
      console.log("ProviderDashboard: Fetched user profile successfully:", data);
      return data; // Return the fetched data
    } catch (err) {
      console.error("Error fetching provider profile:", err);
      toast.error(err.message);
      return null;
    }
  }, [authUser?.userId, token]); // Only depend on userId and token from authUser

  const fetchProviderBookings = useCallback(async () => {
    if (!authUser || !token) {
      console.warn("ProviderDashboard: Cannot fetch bookings. Auth user or token missing.");
      return []; // Return empty array if conditions are not met
    }
    try {
      const res = await fetch(`http://localhost:8081/api/provider/requests`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to load bookings: ${errorText}`);
      }
      const data = await res.json();
      return Array.isArray(data) ? data : []; // Return the fetched data
    } catch (err) {
      console.error("Error fetching provider bookings:", err);
      toast.error(err.message);
      return [];
    }
  }, [authUser?.userId, token]); // Only depend on userId and token from authUser

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const loadDashboardData = async () => {
      if (!isAuthReady || !isAuthenticated || !authUser || authUser.role !== "PROVIDER") {
        if (isAuthReady && (!isAuthenticated || authUser?.role !== "PROVIDER")) {
          toast.info("Unauthorized access or not a provider. Redirecting...");
          navigate(isAuthenticated ? "/customer-dashboard" : "/login");
        }
        setLoading(false); // Ensure loading is false if not authenticated/authorized
        return;
      }

      setLoading(true);

      // Fetch profile data
      const profileData = await fetchProviderProfile();
      if (isMounted && profileData) {
        setProviderProfile(profileData);
        // ONLY update AuthContext if the profile data is newer/different
        // and if it actually contains the 'name' field
        if (authUser.name !== profileData.name || authUser.email !== profileData.email) {
             updateUser(profileData); // Update AuthContext user with full profile data
        }
      } else if (isMounted && !profileData) {
          // If profile fetch failed, consider redirecting or showing an error
          toast.error("Failed to load provider profile. Please try again.");
          // Optional: navigate('/login'); // If profile is essential and cannot be fetched
      }

      // Fetch bookings data
      const bookingsData = await fetchProviderBookings();
      if (isMounted && bookingsData) {
        setBookings(bookingsData);
      } else if (isMounted && !bookingsData) {
        // If bookings fetch failed, set to empty array
        setBookings([]);
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    // Only run this effect if authState changes significantly
    // and when user data becomes available/changes
    // It's important to only trigger if the relevant data changes, not every re-render
    if (isAuthReady && isAuthenticated && authUser?.userId && authUser?.role === "PROVIDER") {
        loadDashboardData();
    }

    return () => {
      isMounted = false; // Cleanup to prevent memory leaks
    };
  }, [isAuthReady, isAuthenticated, authUser?.userId, authUser?.role, fetchProviderProfile, fetchProviderBookings, navigate, updateUser, authUser?.name, authUser?.email]); // Add specific authUser properties that trigger re-fetch


  // Render loading state while data is being fetched
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="mt-3 text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  // Render error/not found state if profile failed to load after loading is complete
  if (!providerProfile) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <h2 className="text-2xl font-semibold text-red-600">Provider profile not found</h2>
        <p className="mt-2 text-gray-600">There was an issue loading your profile. Please try logging in again.</p>
        <button
          className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 bg-white p-4 rounded-xl shadow">
          <nav>
            <ul className="space-y-3">
              {["profile", "bookings", "settings"].map((tab) => (
                <li
                  key={tab}
                  className={`cursor-pointer px-3 py-2 rounded-md ${
                    activeTab === tab
                      ? "bg-indigo-100 text-indigo-700 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </li>
              ))}
              <li
                className="cursor-pointer text-red-600 hover:text-red-700"
                onClick={logout}
              >
                Logout
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1">
          {activeTab === "profile" && (
            <ProviderProfile providerProfile={providerProfile} setProviderProfile={setProviderProfile} />
          )}
          {activeTab === "bookings" && (
            <ProviderBookings bookings={bookings} setBookings={setBookings} />
          )}
          {activeTab === "settings" && (
            <ProviderSettings />
          )}
        </main>
      </div>
    </div>
  );
}