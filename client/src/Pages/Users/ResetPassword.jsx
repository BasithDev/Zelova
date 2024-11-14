import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../../Redux/slices/userDataSlice';

const ResetPassword = () => {
  const userData = useSelector(state => state.userData.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await axios.patch('http://localhost:3000/api/user/reset-password', {
        userId: userData._id,
        oldPassword,
        newPassword,
      });

      if (response.data.status === 'Success') {
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        dispatch(fetchUserData(userData._id));
        navigate('/profile');
      } else {
        toast.error(response.data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer position="top-right" />
      <motion.div
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Reset Password</h2>
        <div className="mb-4">
          <label className="block text-gray-600 font-medium">Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 font-medium">New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full p-3  mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 font-medium">Confirm New Password:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
          />
        </div>
        <div className="mt-6">
          <motion.button
            onClick={handleResetPassword}
            disabled={isChangingPassword}
            className="w-full p-3 bg-orange-500 text-white font-bold text-xl rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 cursor-pointer"
          >
            {isChangingPassword ? 'Updating Password...' : 'Reset Password'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;