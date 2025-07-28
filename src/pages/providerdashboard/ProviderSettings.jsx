import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext"; // Import useAuth hook
import Modal from "react-modal"; // For account deletion confirmation
import ChangePasswordModal from "../../components/modals/ChangePasswordModal"; // New modal component for change password

// Set app element for react-modal (important for accessibility)
Modal.setAppElement('#root');

export default function ProviderSettings() {
  const { user, token, logout } = useAuth(); // Get user, token, logout from AuthContext
  const [modalType, setModalType] = useState(null); // null | 'logout' | 'changePassword' | 'deleteAccount'

  const closeModal = () => setModalType(null);

  const handleChangePasswordSubmit = async ({ oldPassword, newPassword }) => {
    if (!user?.id || !token) {
        toast.error("Authentication required to change password.");
        return;
    }
    closeModal(); // Close the modal immediately to show toast over the main page

    try {
        const response = await fetch(`http://localhost:8081/api/auth/change-password`, { // Assuming this endpoint for change password
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: user.id, // Backend expects userId in body for this endpoint
                currentPassword: oldPassword,
                newPassword: newPassword
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to change password.");
        }

        toast.success(data.message || "Password changed successfully!");
    } catch (error) {
        console.error("Change password error:", error.message);
        toast.error(error.message);
    }
  };

  const confirmAction = async () => {
    if (!user?.id || !token) {
        toast.error("Authentication required for this action.");
        closeModal();
        return;
    }

    if (modalType === "logout") {
      logout(); // Call auth context logout
      toast.info("You have been logged out.");
      window.location.href = "/login"; // Redirect to login page
    } else if (modalType === "deleteAccount") {
        closeModal(); // Close the confirmation modal

        try {
            // Assuming an endpoint for deleting user account
            const response = await fetch(`http://localhost:8081/api/users/${user.id}`, { // Backend: DELETE /api/users/{userId}
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete account.");
            }

            toast.success("Account deleted successfully.");
            logout(); // Clear session after successful deletion
            window.location.href = "/"; // Redirect to home page
        } catch (error) {
            console.error("Account deletion error:", error.message);
            toast.error(error.message);
        }
    }
    closeModal();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <button
        className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={() => setModalType("deleteAccount")}
      >
        Delete Account
      </button>
      <button
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setModalType("changePassword")}
      >
        Change Password
      </button>
      <button
        className="w-full py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
        onClick={() => setModalType("logout")}
      >
        Logout
      </button>
      {/* Logout and Delete Account Confirmation Modal */}
      {(modalType === "logout" || modalType === "deleteAccount") && (
        <Modal
          isOpen={true}
          onRequestClose={closeModal}
          className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg outline-none relative"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {modalType === "logout" && "Confirm Logout"}
            {modalType === "deleteAccount" && "Delete Account"}
          </h3>
          <p className="mb-6 text-gray-600">
            {modalType === "logout" && "Are you sure you want to logout?"}
            {modalType === "deleteAccount" &&
              "This action is irreversible. Are you sure you want to delete your account? All your data will be permanently removed."}
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction}
              className={`px-4 py-2 rounded text-white ${
                modalType === "deleteAccount"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
      {/* Change Password Modal */}
      {modalType === "changePassword" && (
        <ChangePasswordModal
          onClose={closeModal}
          onSubmit={handleChangePasswordSubmit}
        />
      )}
    </div>
  );
}
