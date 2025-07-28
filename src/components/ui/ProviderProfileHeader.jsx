import React from "react";
import { User } from "lucide-react"; // Removed BadgeCheck as it's not used here anymore

function ProviderProfileHeader({ provider }) {
  if (!provider) {
    return null;
  }

  const { name } = provider; // Only name is needed for initial avatar
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="relative">
      {/* Top section: Background color and space for avatar */}
      {/* The h-48 class gives a fixed height to the indigo background */}
      <div className="bg-indigo-700 h-48 w-full flex justify-center items-end">
        {/* Avatar container, positioned at the bottom center of the indigo band */}
        {/* -mb-16 pulls the avatar 16px down, causing it to visually overlap the section below */}
        <div className="relative -mb-16"> 
            {provider.photoUrl ? ( // Placeholder for actual photo URL if available from backend
                <img
                    src={provider.photoUrl}
                    alt={name || "Provider Avatar"}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                />
            ) : ( // If no photo URL, display an initial or generic User icon
                <div
                    className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 text-gray-700
                               flex items-center justify-center text-5xl font-bold shadow-lg"
                >
                    {name ? initial : <User className="w-16 h-16" />}
                </div>
            )}
        </div>
      </div>
      {/* The name and badge section has been removed from here */}
    </div>
  );
}

export default ProviderProfileHeader;