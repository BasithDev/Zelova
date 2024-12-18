import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PrimaryBtn from '../../Components/Buttons/PrimaryBtn';
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaKey } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { sendOTPForResetPassword,verifyOTPForResetPassword, resetPassword } from '../../Services/apiServices';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const response = await sendOTPForResetPassword({ email });
      if (response.data.status === 'Success') {
        toast.success('OTP sent successfully');
        setShowOtpField(true);
        setIsEmailSubmitted(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
      setIsEmailSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const response = await verifyOTPForResetPassword({ email, otp });
      if (response.data.status === 'Success') {
        toast.success('OTP verified successfully');
        setShowPasswordField(true);
        setIsOtpSubmitted(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
      setIsOtpSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const response = await resetPassword({ email, password: newPassword });
      if (response.data.status === 'Success') {
        toast.success('Password reset successfully');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <ToastContainer position='top-right'/>
      <div className="bg-orange-200 w-full lg:w-[480px] h-[120px] lg:h-auto flex items-center justify-center lg:rounded-r-xl">
        <div className="text-7xl lg:text-9xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">Z</div>
      </div>
      <motion.div
        className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl lg:text-3xl font-extrabold text-center mb-6 lg:mb-8 text-gray-800">Forgot Password</h2>
        <div className="w-full max-w-md mx-auto px-4">
          <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 mb-4">
              <div className="flex w-full">
                <div className="bg-orange-200 p-3 lg:p-3.5 rounded-l-lg flex items-center justify-center">
                  <MdAlternateEmail className="text-orange-500" />
                </div>
                <input 
                  type="email" 
                  placeholder="Email ID" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isEmailSubmitted || loading}
                  className={`w-full p-2 lg:p-[9px] border border-gray-300 rounded-r-lg focus:outline-none bg-white bg-opacity-50 ${(isEmailSubmitted || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>
              <PrimaryBtn
                text={loading ? <BeatLoader size={8} color="#ffffff" /> : "Send OTP"}
                onClick={handleSendOtp}
                disabled={isEmailSubmitted || loading || !email}
                className={`w-full sm:w-auto px-4 py-2 lg:py-2.5 bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white font-bold rounded-lg whitespace-nowrap ${(isEmailSubmitted || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>

            {showOtpField && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 mb-4"
              >
                <div className="flex w-full">
                  <div className="bg-orange-200 p-3 lg:p-3.5 rounded-l-lg flex items-center justify-center">
                    <FaKey className="text-orange-500" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isOtpSubmitted || loading}
                    className={`w-full p-2 lg:p-[9px] border border-gray-300 rounded-r-lg focus:outline-none bg-white bg-opacity-50 ${(isOtpSubmitted || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                </div>
                <PrimaryBtn
                  text={loading ? <BeatLoader size={8} color="#ffffff" /> : "Verify"}
                  onClick={handleVerifyOtp}
                  disabled={isOtpSubmitted || loading || !otp}
                  className={`w-full sm:w-auto px-4 py-2 lg:py-2.5 bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white font-bold rounded-lg whitespace-nowrap ${(isOtpSubmitted || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </motion.div>
            )}

            {showPasswordField && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 mb-4"
              >
                <div className="flex w-full">
                  <div className="bg-orange-200 p-3 lg:p-3.5 rounded-l-lg flex items-center justify-center">
                    <RiLockPasswordFill className="text-orange-500" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="New Password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className={`w-full p-2 lg:p-[9px] border border-gray-300 rounded-r-lg focus:outline-none bg-white bg-opacity-50 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                </div>
                <PrimaryBtn
                  text={loading ? <BeatLoader size={8} color="#ffffff" /> : "Change"}
                  onClick={handleChangePassword}
                  disabled={loading || !newPassword}
                  className={`w-full sm:w-auto px-4 py-2 lg:py-2.5 bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white font-bold rounded-lg whitespace-nowrap ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="mt-6 text-center" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6 }}
          >
            <Link to="/login">
              <button
                className="w-full sm:w-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-bold rounded-lg whitespace-nowrap"
              >
                Back to Login
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;