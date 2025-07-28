import React, { useEffect, useState, useCallback } from "react";
import ProfileCard from "./ProfileCard";
import BookingsList from "./BookingsList";
import Navbar from "../../components/ui/Navbar";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { user: authUser, token, isAuthenticated, isAuthReady, updateUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const navigate = useNavigate();

  // Effect for redirection: Wait until AuthContext is ready
  useEffect(() => {
    if (isAuthReady) {
      if (!isAuthenticated || !authUser || !authUser.userId || !token) {
        console.warn("UserDashboard: AuthContext ready, but user is not authenticated or data is incomplete. Redirecting to login.");
        toast.error("You need to be logged in to view the dashboard.");
        navigate('/login');
      }
    }
  }, [isAuthReady, isAuthenticated, authUser, token, navigate]); //

  // Effect to fetch User Profile: Wait until AuthContext is ready AND authenticated
  const fetchUserProfile = useCallback(async () => {
    if (!isAuthReady || !isAuthenticated || !authUser || !token) {
      setLoadingProfile(false);
      return; // Do not fetch if not ready or not authenticated
    }

    // Only fetch if userProfile is null, or authUser.userId changes, to avoid redundant fetches
    // This is important to prevent re-fetching if userProfile is already set.
    if (userProfile && userProfile.id === authUser.userId) {
      setLoadingProfile(false);
      return;
    }

    setLoadingProfile(true);
    console.log(`UserDashboard: Authenticated & Auth Ready. Starting fetchUserProfile for userId: ${authUser.userId}`);
    try {
      const response = await fetch(`http://localhost:8081/api/users/${authUser.userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = response.status === 403 ? { error: "Access Denied. You do not have permission to view this profile." } : await response.json();
        throw new Error(errorData.error || `Failed to fetch user profile: ${response.statusText}`);
      }

      const data = await response.json();
      setUserProfile(data);
      updateUser(data); // Update user data in AuthContext
      console.log("UserDashboard: Fetched user profile successfully:", data);
    } catch (error) {
      console.error("UserDashboard: Error fetching user profile:", error);
      toast.error(`Failed to load profile: ${error.message}`);
    } finally {
      setLoadingProfile(false);
      console.log("UserDashboard: Finished fetchUserProfile.");
    }
  }, [isAuthReady, isAuthenticated, authUser, token, updateUser, userProfile]); //

  // Effect to call fetchUserProfile when auth state is ready and user is authenticated
  useEffect(() => {
    if (isAuthReady && isAuthenticated && authUser && token) {
      fetchUserProfile();
    }
  }, [isAuthReady, isAuthenticated, authUser, token, fetchUserProfile]); //


  // Effect to fetch User Bookings (Service Requests)
  const fetchUserBookings = useCallback(async () => {
    // Make sure userProfile is loaded before fetching bookings, as bookings might depend on profile data
    if (!isAuthReady || !isAuthenticated || !authUser || !token || !userProfile) {
      setLoadingBookings(false);
      return; // Do not fetch if not ready or not authenticated, or profile not loaded
    }

    setLoadingBookings(true);
    console.log(`UserDashboard: Profile loaded. Starting fetchBookings for userId: ${authUser.userId}`);
    try {
      // CRITICAL FIX: Changed the endpoint to match CustomerController.java
      const response = await fetch(`http://localhost:8081/api/customers/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = response.status === 403 ? { error: "Access Denied. You do not have permission to view your bookings." } : await response.json();
        throw new Error(errorData.error || `Failed to fetch bookings: ${response.statusText}`);
      }

      const data = await response.json();
      // Backend might return { message: "No service requests found..." } if empty
      setBookings(Array.isArray(data) ? data : []); // Ensure it's an array
      console.log("UserDashboard: Fetched bookings successfully:", data);
    } catch (error) {
      console.error("UserDashboard: Error fetching bookings:", error);
      toast.error(`Failed to load bookings: ${error.message}`);
    } finally {
      setLoadingBookings(false);
    }
  }, [isAuthReady, isAuthenticated, authUser, token, userProfile]); // userProfile is now a dependency

  // Effect to call fetchUserBookings when userProfile is loaded and other auth conditions are met
  useEffect(() => {
    if (isAuthReady && isAuthenticated && authUser && token && userProfile) {
      fetchUserBookings();
    }
  }, [isAuthReady, isAuthenticated, authUser, token, userProfile, fetchUserBookings]); //


  const isLoading = loadingProfile || loadingBookings; //

  // IMPORTANT: This is the crucial guard for rendering
  // If authentication is not yet ready, or user is not authenticated (and redirection hasn't happened yet),
  // or userProfile is still loading/null, render a loading state.
  if (!isAuthReady || (isAuthReady && (!isAuthenticated || !userProfile))) {
      // This will prevent any content that relies on `isAuthenticated` or `userProfile` from rendering
      // prematurely, thus avoiding the warning.
      // The redirection useEffect will handle navigation for unauthenticated users.
      // This part handles the interim state where auth is ready but profile is not yet fetched.
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-gray-600">Loading user dashboard...</div>
        </div>
      );
  }

  // Once we reach here, we are confident that isAuthReady is true, isAuthenticated is true,
  // and userProfile is loaded.
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4 bg-white p-6 rounded-xl shadow-lg h-fit">
          <h3 className="text-2xl font-semibold mb-4">Dashboard</h3>
          <ul className="space-y-2">
            <li
              className={`cursor-pointer px-3 py-2 rounded hover:bg-indigo-100 ${activeTab ===
                "profile" ? "bg-indigo-100 font-semibold" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              My Profile
            </li>
            <li
              className={`cursor-pointer px-3 py-2 rounded hover:bg-indigo-100 ${activeTab ===
                "orders" ? "bg-indigo-100 font-semibold" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              My Orders
            </li>
            <li
              className={`cursor-pointer px-3 py-2 rounded hover:bg-indigo-100 ${activeTab ===
                "favorites" ? "bg-indigo-100 font-semibold" : ""}`}
              onClick={() => setActiveTab("favorites")}
            >
              Favorites
            </li>
          </ul>
        </div>
        {/* Main Content */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-6">Welcome, {userProfile?.name?.split(" ")[0] || "User"}</h2>
          {isLoading ? ( // This isLoading check is still valuable for tabs changing or other async data
            <div className="flex items-center justify-center h-64">
              <div className="text-xl text-gray-600">Loading dashboard data...</div>
            </div>
          ) : (
            <>
              {activeTab === "profile" && <ProfileCard userProfile={userProfile} setUserProfile={setUserProfile} />}
              {activeTab === "orders" && <BookingsList bookings={bookings} />}
              {activeTab === "favorites" && (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">My Favorites</h3>
                  <p className="text-gray-600">No favorite providers added yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}