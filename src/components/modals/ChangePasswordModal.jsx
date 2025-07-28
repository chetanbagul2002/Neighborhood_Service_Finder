import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { X } from "lucide-react"; // For close icon

// Ensure Modal.setAppElement('#root') is in index.js

function ChangePasswordModal({ onClose, onSubmit }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError(""); // Clear previous errors

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError("All password fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password cannot be the same as the current password.");
      return;
    }

    // Call the onSubmit prop passed from the parent (e.g., ProviderSettings)
    onSubmit({ oldPassword, newPassword });
    // The parent component will handle closing the modal after API call.
  };

  return (
    <Modal
      isOpen={true} // Always open when rendered by parent
      onRequestClose={onClose}
      className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg outline-none relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        aria-label="Close modal"
      >
        <X size={24} />
      </button>
      <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Change Password</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1" htmlFor="old-password">
            Old Password
          </label>
          <input
            id="old-password"
            type="password"
            placeholder="••••••••"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="current-password"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1" htmlFor="new-password">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1" htmlFor="confirm-new-password">
            Confirm New Password
          </label>
          <input
            id="confirm-new-password"
            type="password"
            placeholder="••••••••"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="new-password"
          />
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default ChangePasswordModal;
