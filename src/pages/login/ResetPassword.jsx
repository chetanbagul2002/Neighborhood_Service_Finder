import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import bgImg from "../../assets/bg-login.png";

Modal.setAppElement("#root");

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setModalOpen(true);
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden m-0 p-0">
      <div
        className="absolute inset-0 bg-cover bg-center z-0 w-full h-full"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>

      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-white text-sm mb-2 font-medium">New Password</label>
              <div className="flex items-center px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white">
                <Lock className="mr-2 text-white" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent outline-none placeholder-white/70 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm mb-2 font-medium">Confirm Password</label>
              <div className="flex items-center px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white">
                <Lock className="mr-2 text-white" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent outline-none placeholder-white/70 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition duration-300"
            >
              Reset Password
            </button>
          </form>
        </motion.div>
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white rounded-xl p-6 max-w-md mx-auto mt-32 outline-none shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
          Password reset successful!
        </h2>
        <p className="text-center text-gray-600 mb-4">Redirecting to login page...</p>
      </Modal>
    </div>
  );
}

export default ResetPassword;
