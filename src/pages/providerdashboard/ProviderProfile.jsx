import React, { useState, useEffect } from "react";
import { Pencil, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function ProviderProfile({ providerProfile, setProviderProfile }) {
  const { token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (providerProfile) {
      setFormData({
        name: providerProfile.name || "",
        email: providerProfile.email || "",
        phone: providerProfile.phone || "",
        address: providerProfile.address || "",
        city: providerProfile.city || "",
        state: providerProfile.state || "",
        country: providerProfile.country || "",
        serviceType: providerProfile.serviceType || "",
        available: providerProfile.available ?? false, // Use ?? false to handle null/undefined from backend
        averageRating: providerProfile.averageRating ?? null,
        aadhaarNumber: providerProfile.aadhaarNumber || "", // Ensure aadhaarNumber is initialized
        phoneVerified: providerProfile.phoneVerified || false,
        accountVerified: providerProfile.accountVerified || false,
        bio: providerProfile.bio || "", // NEW: Initialize bio
      });
    }
  }, [providerProfile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("http://localhost:8081/api/providers/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Only send editable fields. Aadhaar is non-editable and thus not sent.
        body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            serviceType: formData.serviceType,
            available: formData.available,
            profilePhoto: formData.profilePhoto, // Include profilePhoto if you plan to implement its update
            bio: formData.bio, // NEW: Include bio in the payload
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProviderProfile(updatedData); // Update parent state with the returned data
        setEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("An error occurred while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
        {!editing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <Pencil size={18} /> Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Profile photo section */}
        <div className="mb-6 relative w-24 h-24"> {/* Added relative positioning */}
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {formData.profilePhoto ? (
              <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            )}
          </div>
          {formData.accountVerified && ( // Conditionally render verified icon
            <CheckCircle
              size={24}
              className="text-green-500 absolute bottom-0 right-0 bg-white rounded-full"
              style={{ transform: 'translate(25%, 25%)' }} // Adjust position
            />
          )}
          {editing && (
            <button className="mt-2 text-blue-600 hover:underline">
              Change Photo
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="mt-1 p-2 text-gray-900 bg-gray-50 rounded-md">{formData.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 p-2 text-gray-900 bg-gray-50 rounded-md">{formData.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            {editing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="mt-1 p-2 text-gray-900 bg-gray-50 rounded-md">{formData.phone}</p>
            )}
            {formData.phoneVerified ? (
              <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                <CheckCircle size={14} /> Phone Verified
              </p>
            ) : (
              <p className="text-red-500 text-sm mt-1">Phone Not Verified</p>
            )}
          </div>

          {/* Non-editable Aadhaar Number field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
            <p className="mt-1 p-2 text-gray-900 bg-gray-50 rounded-md">{formData.aadhaarNumber || "N/A"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            {editing ? (
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="mt-1 p-2 text-gray-900 bg-gray-50 rounded-md">{formData.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            {editing ? (
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="mt-1 p-2 text-gray-900 bg-gray-50 rounded-md">{formData.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            {editing ? (
              <input
                type="text"
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="mt-1 p-2 text-gray-900 bg-gray-50 rounded-md">{formData.state}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            {editing ? (
              <input
                type="text"
                name="country"
                value={formData.country || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="mt-1 p-2 text-gray-900 bg-gray-50 rounded-md">{formData.country}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Service Type</label>
            {editing ? (
              <input
                type="text"
                name="serviceType"
                value={formData.serviceType || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="mt-1 p-2 text-gray-900 bg-gray-50 rounded-md">{formData.serviceType}</p>
            )}
          </div>

          {/* NEW: Bio field */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            {editing ? (
              <textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about yourself and your services..."
              ></textarea>
            ) : (
              <p className="mt-1 p-2 text-gray-900 bg-gray-50 rounded-md whitespace-pre-wrap">{formData.bio || "No bio provided."}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              {editing ? (
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              ) : (
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  readOnly // Make it read-only when not editing
                  className="rounded text-blue-600"
                />
              )}
              Available for Work
            </label>
          </div>

          {providerProfile?.accountVerified !== undefined && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Account Status</label>
              {formData.accountVerified ? (
                <p className="text-green-600 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle size={16} /> Verified by Admin
                </p>
              ) : (
                <p className="text-orange-500 font-medium mt-1 text-sm">Awaiting admin verification</p>
              )}
            </div>
          )}
        </div>

        {editing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
              disabled={saving}
            >
              {saving ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-gray-100"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}