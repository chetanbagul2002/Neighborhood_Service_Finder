import React, { useState, useEffect } from "react";
import { Pencil, UploadCloud, UserCircle2, BadgeCheck, CheckCircle } from "lucide-react"; // Added CheckCircle icon
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import Modal from "react-modal";
import OtpVerificationModal from "../../components/modals/OtpVerificationModal";

// Make sure to call Modal.setAppElement('#root') in your main index.js or App.jsx
// It's already in index.js for you.

export default function ProfileCard({ userProfile, setUserProfile }) {
  const { token, updateUser: updateAuthUser } = useAuth();
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [originalPhone, setOriginalPhone] = useState("");
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // New state for success modal

  useEffect(() => {
    if (userProfile) {
      setForm({
        id: userProfile.id,
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        city: userProfile.city || "",
        state: userProfile.state || "",
        country: userProfile.country || "",
        phoneVerified: userProfile.phoneVerified,
        accountVerified: userProfile.accountVerified,
        profilePhoto: userProfile.profilePhoto || "" 
      });
      setProfileImage(userProfile.profilePhoto || null);
      setOriginalPhone(userProfile.phone || "");
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (form.phone !== originalPhone && !form.phoneVerified) {
        setShowPhoneOtpModal(true);
        toast.info("Phone number changed. Please verify the new number with OTP.");
        return;
    }

    setLoadingSave(true);
    try {
      const response = await fetch(`http://localhost:8081/api/customers/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          profilePhoto: form.profilePhoto
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Profile update failed.");
      }

      setUserProfile(data);
      updateAuthUser(data);
      toast.success("Profile updated successfully!");
      setShowSuccessModal(true); // Show success modal on successful save
      setEditing(false);
      setOriginalPhone(data.phone);

    } catch (error) {
      console.error("Profile update error:", error.message);
      toast.error(error.message);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      toast.info("Profile image updated locally. Actual upload to backend not implemented yet.");
    }
  };

  const handlePhoneOtpRequest = async () => {
    if (!form.phone || !/^[0-9]{10}$/.test(form.phone)) {
        toast.error("Enter a valid 10-digit mobile number to send OTP.");
        return;
    }
    setShowPhoneOtpModal(true);
  };

  const handlePhoneOtpSuccess = async () => {
    setShowPhoneOtpModal(false);
    toast.success("Mobile number verified successfully!");
    setUserProfile(prev => ({ ...prev, phoneVerified: true, accountVerified: prev.role === 'CUSTOMER' ? true : prev.accountVerified }));
    updateAuthUser(prev => ({ ...prev, phoneVerified: true, accountVerified: prev.role === 'CUSTOMER' ? true : prev.accountVerified }));
  };

  const resetForm = () => {
    setForm({
        id: userProfile.id,
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        city: userProfile.city || "",
        state: userProfile.state || "",
        country: userProfile.country || "",
        phoneVerified: userProfile.phoneVerified,
        accountVerified: userProfile.accountVerified,
        profilePhoto: userProfile.profilePhoto || ""
    });
    setProfileImage(userProfile.profilePhoto || null);
    setEditing(false);
    setOriginalPhone(userProfile.phone);
    toast.info("Changes discarded.");
  };

  const renderInputField = (field, label, type = "text", maxLength = null, disabled = false) => (
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-gray-700">{label}</label>
      {editing && !disabled ? (
        <input
          type={type}
          name={field}
          value={form[field] || ""}
          onChange={e => {
            if (field === 'phone' && e.target.value.length > 10) return;
            setForm({ ...form, [field]: e.target.value });
          }}
          placeholder={label}
          maxLength={maxLength}
          className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <p className="text-gray-800">{form[field] || "N/A"}</p>
      )}
    </div>
  );


  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mb-10 flex gap-6 items-start">
      <div className="relative w-24 h-24">
        <img
          src={
            profileImage ||
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
          }
          alt="Profile"
          className="rounded-full object-cover w-full h-full border-4 border-indigo-500"
        />
        {editing && (
          <label className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700">
            <UploadCloud className="text-white w-4 h-4" />
            <input type="file" onChange={handleImageChange} className="hidden" />
          </label>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Your Profile</h3>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center text-blue-600 hover:underline"
          >
            <Pencil className="w-4 h-4 mr-1" /> {editing ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderInputField("name", "Full Name")}
          {renderInputField("email", "Email", "email", null, true)}

          <div className="flex gap-2">
            <input
              type="text"
              value={form.phone || ""}
              disabled={!editing}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 10) {
                    setForm({ ...form, phone: val, phoneVerified: (val === originalPhone && userProfile.phoneVerified) ? true : false });
                }
              }}
              maxLength="10"
              placeholder="Phone Number"
              className="w-full border p-2 rounded bg-gray-50"
            />
            {editing && (
              <>
                {form.phoneVerified ? (
                    <span className="px-3 py-2 bg-green-100 text-green-700 rounded text-sm flex items-center">Verified <BadgeCheck className="ml-1 w-4 h-4"/></span>
                ) : (
                    <button
                        type="button"
                        onClick={handlePhoneOtpRequest}
                        className="px-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
                        disabled={!form.phone || form.phone.length !== 10 || loadingSave}
                    >
                        Send OTP
                    </button>
                )}
              </>
            )}
          </div>
          
          {userProfile?.role === "PROVIDER" && (
             <div className="mb-4">
                 <label className="block font-semibold mb-1 text-gray-700">Aadhaar Number</label>
                 {editing ? (
                     <input
                         type="text"
                         name="aadhaar"
                         value={form.aadhaar || ""}
                         onChange={(e) => {
                             const formatted = e.target.value
                                 .replace(/\D/g, "")
                                 .slice(0, 12)
                                 .replace(/(\d{4})(?=\d)/g, "$1 ");
                             setForm({ ...form, aadhaar: formatted });
                         }}
                         placeholder="XXXX XXXX XXXX"
                         maxLength="14"
                         className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     />
                 ) : (
                     <p className="text-gray-800">{form.aadhaar || "N/A"}</p>
                 )}
                 {userProfile.accountVerified ? (
                    <p className="text-green-600 font-medium mt-1 text-sm flex items-center"><BadgeCheck className="w-4 h-4 mr-1"/> Admin Verified</p>
                 ) : (
                    <p className="text-orange-500 font-medium mt-1 text-sm">Awaiting admin verification</p>
                 )}
             </div>
          )}


          {renderInputField("address", "Address")}
          {renderInputField("city", "City")}
          {renderInputField("state", "State")}
          {renderInputField("country", "Country")}
        </div>
        {editing && (
          <button
            onClick={handleSave}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={loadingSave}
          >
            {loadingSave ? 'Saving...' : 'Save Changes'}
          </button>
        )}
        {editing && (
            <button
                onClick={resetForm}
                className="mt-4 ml-3 border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-gray-100"
            >
                Cancel
            </button>
        )}
      </div>

      {/* OTP Verification Modal for Phone Change */}
      {showPhoneOtpModal && (
        <OtpVerificationModal
          userId={form.id}
          mobileNumber={form.phone}
          onClose={() => setShowPhoneOtpModal(false)}
          onSuccess={handlePhoneOtpSuccess}
        />
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
        contentLabel="Profile Saved Successfully"
        className="modal-content p-6 bg-white rounded-lg shadow-xl max-w-sm mx-auto my-20 relative"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="flex flex-col items-center justify-center p-4">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Profile Saved!</h2>
          <p className="text-gray-600 text-center mb-6">Your profile has been updated successfully.</p>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
}