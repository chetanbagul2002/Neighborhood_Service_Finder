import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/ui/Navbar";
import { Star, BadgeCheck, Heart } from "lucide-react";
import { toast } from "react-toastify";

function ProvidersListPage() {
  const { serviceCategory } = useParams();
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000);
  const [locationFilter, setLocationFilter] = useState("");
  const [uniqueLocations, setUniqueLocations] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  // totalPages should realistically come from backend if pagination is implemented
  // For now, if backend returns a simple list, totalPages will be 1
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  const [favorites, setFavorites] = useState(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites");
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (ratingFilter > 0) queryParams.append("minRating", ratingFilter);
      if (priceMin > 0) queryParams.append("minPrice", priceMin);
      if (priceMax < 10000) queryParams.append("maxPrice", priceMax);
      if (locationFilter) queryParams.append("location", locationFilter);

      // Backend pagination parameters
      queryParams.append("page", currentPage - 1); // Backend expects 0-indexed page
      queryParams.append("size", itemsPerPage);

      // Verify this URL matches your Spring Boot application's URL
      const API_BASE_URL = "http://localhost:8081/api/public"; // <-- Adjusted from 8081 to 8080 based on common Spring Boot default
      const url = `${API_BASE_URL}/provider/category/${serviceCategory}?${queryParams.toString()}`;

      console.log("Fetching from URL:", url); // Log the URL for debugging

      const response = await fetch(url);
      const data = await response.json(); // Parse the JSON response

      if (!response.ok) {
        // If response is not OK (e.g., 404, 500), 'data' might contain an error object or just a message
        throw new Error(data.error || data.message || "Failed to fetch providers.");
      }

      // Handle the two possible successful responses from backend:
      // 1. An array of ProviderResponse objects
      // 2. A map with a "message" key if no providers are found
      if (Array.isArray(data)) {
        setProviders(data); // Backend returns a direct array of providers
        // If backend doesn't provide total pages, assume it's just a single page result
        // or you'd need a separate endpoint for total count
        setTotalPages(1); // Set to 1 as current backend endpoint does not return pagination metadata with the array
        console.log("Providers received:", data); // Log received data for verification
      } else if (data && data.message && data.message.includes("No providers found")) {
        setProviders([]); // Set to empty array if "No providers found" message
        setTotalPages(1);
        console.log("No providers found message:", data.message);
      } else {
        console.error("Unexpected data format:", data);
        throw new Error("Received data in an unexpected format.");
      }

      // Collect unique locations from fetched providers for the filter dropdown
      const fetchedLocations = Array.from(
        new Set((Array.isArray(data) ? data : []).map((p) => p.address || "N/A"))
      );
      setUniqueLocations((prev) => {
        const currentUnique = new Set(prev);
        fetchedLocations.forEach((loc) => currentUnique.add(loc));
        return Array.from(currentUnique);
      });

    } catch (err) {
      console.error("Error fetching providers:", err);
      setError(err.message || "Could not load providers. Please try again.");
      toast.error(`Error: ${err.message || "Could not load providers."}`);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, [serviceCategory, ratingFilter, priceMin, priceMax, locationFilter, currentPage, itemsPerPage]); // Added itemsPerPage to dependencies

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    setCurrentPage(1); // Reset page to 1 when filters or category change
  }, [serviceCategory, ratingFilter, priceMin, priceMax, locationFilter]);

  const handleRatingChange = (e) => setRatingFilter(parseFloat(e.target.value));
  const handlePriceMinChange = (e) => setPriceMin(parseFloat(e.target.value));
  const handlePriceMaxChange = (e) => setPriceMax(parseFloat(e.target.value));
  const handleLocationChange = (e) => setLocationFilter(e.target.value);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-tr from-indigo-50 via-white to-purple-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-700 mb-12 capitalize">
          {serviceCategory ? `${serviceCategory} Providers` : "Find the Best Providers"}
        </h1>

        <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
          {/* Filters Sidebar */}
          <div className="md:w-1/4 sticky top-24 bg-white shadow-xl p-6 rounded-2xl h-fit">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">Filters</h2>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="font-semibold text-gray-700">Minimum Rating</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={ratingFilter}
                onChange={handleRatingChange}
                className="w-full mt-2 accent-indigo-600"
              />
              <p className="text-sm mt-1">{ratingFilter} stars & up</p>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="font-semibold text-gray-700">Price Range (₹)</label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={handlePriceMinChange}
                  placeholder="Min"
                  className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  value={priceMax}
                  onChange={handlePriceMaxChange}
                  placeholder="Max"
                  className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            {/* Location Filter */}
            <div className="mb-6">
              <label className="font-semibold text-gray-700">Location</label>
              <select
                value={locationFilter}
                onChange={handleLocationChange}
                className="w-full p-2 border rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Providers List */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-lg text-gray-700">Loading providers...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-600">
                <p>{error}</p>
                <p>Please try refreshing the page.</p>
              </div>
            ) : providers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {providers.map((provider) => (
                  <motion.div
                    key={provider.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all
flex flex-col items-center text-center relative min-h-[420px]"
                  >
                    <button
                      onClick={() => toggleFavorite(provider.id)}
                      className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-pink-100 transition z-10"
                      aria-label="Add to favorites"
                    >
                      <Heart
                        className={`w-5 h-5 ${favorites.includes(provider.id)
                            ? "text-pink-500 fill-pink-500"
                            : "text-gray-400"
                          }`}
                      />
                    </button>
                    <img
                      src={provider.profilePictureUrl || `https://placehold.co/96x96/e0e7ff/6366f1?text=${provider.name ? provider.name.charAt(0) : '?'}`}
                      alt={provider.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 mb-4"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/96x96/e0e7ff/6366f1?text=${provider.name ? provider.name.charAt(0) : '?'}`; }}
                    />
                    <h3 className="text-lg font-bold text-indigo-700 flex items-center justify-center
gap-1">
                      {provider.name} {/* Access name directly from ProviderResponse */}
                      {provider.accountVerified && ( // Access accountVerified from ProviderResponse
                        <BadgeCheck
                          className="w-4 h-4 text-green-500"
                          title="Account Verified"
                        />
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{provider.address || 'N/A'}</p> {/* Access address directly from ProviderResponse */}
                    <div className="flex flex-wrap justify-center gap-2 my-3">
                      <span className={`px-3 py-1 text-xs rounded-full capitalize ${
                          provider.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {provider.available ? "Available Now" : "Not Available"}
                      </span>
                      {/* Gender is not in ProviderResponse, remove or add if applicable */}
                      {/*
                      <span className="px-3 py-1 text-xs rounded-full bg-pink-100 text-pink-600
capitalize">
                        {provider.gender || 'N/A'}
                      </span>
                      */}
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-2">
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-5 h-5" fill="currentColor" />
                        <span className="ml-1 text-sm font-semibold">
                          {provider.averageRating !== undefined && provider.averageRating !== null
                            ? provider.averageRating.toFixed(1)
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="text-indigo-600 text-sm font-medium">
                        ₹{provider.hourlyRate !== undefined && provider.hourlyRate !== null
                          ? provider.hourlyRate.toFixed(2) // Display with 2 decimal places
                          : 'N/A'} <span className="text-gray-500 text-xs">/hr</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                      "{provider.bio || "No bio available."}" {/* Bio is in Provider.java, assuming it's included in ProviderResponse */}
                    </p>
                    <button
                      onClick={() => navigate(`/provider/${provider.id}`)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-5 py-2
text-sm font-semibold mt-auto mt-6 transition"
                    >
                      View Profile
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="col-span-full text-center mt-10">
                <BadgeCheck className="mx-auto text-indigo-400 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold text-gray-600">No Providers Found</h2>
                <p className="text-gray-400 mt-2">Try adjusting your filters!</p>
              </div>
            )}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-full disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-semibold text-indigo-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded-full disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ProvidersListPage;