import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../../Redux/slices/userDataSlice'

const EditId = () => {
  const userData = useSelector(state => state.userData.data);
  const dispatch = useDispatch()
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const navigate = useNavigate()
  const handleSendOtp = async () => {
    if (!newEmail) {
      toast.error("Please enter a new email.");
      return;
    }
    if (newEmail === userData.email) {
      toast.error("New email should be different from the old email.");
      return;
    }
    setIsSendingOtp(true);
    try {
      const response = await axios.post('http://localhost:3000/api/user/send-otp', { email: newEmail });
      if (response.data.status === 'Success') {
        setIsOtpSent(true);
        toast.success("OTP sent successfully.");
      } else {
        toast.error("Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred.");
    } finally {
      setIsSendingOtp(false);
    }
  };
  const handleChangeId = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    setIsChangingEmail(true);
    try {
      const response = await axios.patch('http://localhost:3000/api/user/update-email', {
        userId: userData._id,
        email: newEmail,
        otp,
      });
      if (response.data.status === 'Success') {
        setNewEmail('');
        setOtp('');
        setIsOtpSent(false);
        dispatch(fetchUserData(userData._id))
        navigate('/profile')
      } else {
        toast.error(response.data.message || "Failed to update email.");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("An error occurred while updating the email.");
    } finally {
      setIsChangingEmail(false);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer position="top-right" />
      <motion.div
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Edit Email ID</h2>
        <div className="mb-4">
          <label className="block text-gray-600 font-medium">Old Email:</label>
          <input
            type="email"
            value={userData.email}
            readOnly
            className="w-full p-3 mt-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 font-medium">New Email:</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
          />
        </div>
        {!isOtpSent ? (
          <div className="mb-4">
            <motion.button
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className={`w-full text-xl font-bold p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${isSendingOtp && 'cursor-wait'}`}
            >
              {isSendingOtp ? 'Sending OTP...' : <><FaPaperPlane className="inline mr-2" /> Send OTP</>}
            </motion.button>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Enter OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
            />
          </div>
        )}
        <div className="mt-6">
          <motion.button
            onClick={handleChangeId}
            disabled={isChangingEmail || !otp}
            className="w-full p-3 bg-orange-500 text-white font-bold text-xl rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 cursor-pointer"
          >
            {isChangingEmail ? 'Updating Email...' : 'Change Email ID'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
export default EditId;