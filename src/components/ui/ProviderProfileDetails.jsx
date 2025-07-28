import React, { useState } from "react";
import { Star, MapPin, Heart, BadgeCheck } from "lucide-react"; // Re-added BadgeCheck
import BookingForm from "./BookingForm";

function ProviderProfileDetails({ provider }) {
  const [showBooking, setShowBooking] = useState(false);

  const handleBookClick = () => setShowBooking(true);

  if (!provider) {
    return null;
  }

  // Destructure properties including name and accountVerified
  const { id, name, serviceType, address, available, averageRating, hourlyRate, bio, accountVerified } = provider; 

  return (
    <div className="relative">
      {/* Main Profile Content with conditional blur */}
      <div className={`transition-all duration-300 ${showBooking ? "blur-sm pointer-events-none" : ""}`}>
        {/* Adjusted mt-24 to mt-16 to pull the details card up slightly, balancing the layout after header change */}
        <div className="max-w-4xl mx-auto mt-16 bg-white p-8 rounded-2xl shadow-xl"> 
          <div className="flex flex-col items-center">
            {/* Provider Name and Verified Badge - re-added here */}
            <h1 className="text-3xl font-bold text-indigo-800 flex items-center gap-2 mb-4"> {/* Added mb-4 for spacing */}
              {name || "Unnamed Provider"}
              {accountVerified && ( // Conditionally render BadgeCheck if account is verified
                <BadgeCheck className="w-6 h-6 text-blue-500" title="Verified Provider" />
              )}
            </h1>

            <div className="flex items-center gap-2 mt-2 text-gray-500">
              <MapPin className="w-5 h-5" />
              <span>{address || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-yellow-500">
              <Star className="w-5 h-5" fill="currentColor" />
              <span className="text-lg font-semibold">{averageRating?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="mt-2 text-indigo-600 font-semibold text-lg">
              {hourlyRate !== null ? `€${hourlyRate}/hour` : 'N/A'}
            </div>
            <div className="mt-4">
              <button className="bg-pink-500 hover:bg-pink-400 text-white px-5 py-2 rounded-full
font-semibold flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Save to Favorites
              </button>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">About Me</h2>
            <p className="text-gray-600">{bio || "This provider has not yet added a bio."}</p>
          </div>

          {serviceType && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Service Provided</h2>
              <ul className="list-disc list-inside text-gray-600">
                <li>{serviceType}</li>
              </ul>
            </div>
          )}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Pricing</h2>
            <ul className="list-disc list-inside text-gray-600">
                {hourlyRate !== null ? (
                    <li>Hourly Rate: €{hourlyRate}</li>
                ) : (
                    <li>Pricing details not available.</li>
                )}
            </ul>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={handleBookClick}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full text-lg
font-semibold"
            >
              Contact / Book Now
            </button>
          </div>
        </div>
      </div>
      {showBooking && (
        <>
          <style>{`body { overflow: hidden; }`}</style>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-2 sm:px-0">
            <div className="rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] p-0">
              <BookingForm provider={provider} onClose={() => setShowBooking(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProviderProfileDetails;