import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {verifyOTP,resendOTP} from '../../Services/apiServices'
import PrimaryBtn from '../../Components/Buttons/PrimaryBtn';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Otp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.emailForOtp;

    const [otp, setOtp] = useState('');
    const [cooldown, setCooldown] = useState(30);

    useEffect(() => {
        if (!email) {
            toast.error('Email not provided. Please go back to the registration page.');
        }
    }, [email]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleVerifyOtp = async () => {
        const response = await verifyOTP({ email, otp });
            toast.success(response.data.message);
            navigate('/login');
    };

    const handleResendOtp = async () => {
        if (cooldown > 0) return;
        const response = await resendOTP({ email });
        toast.success(response.data.message);
        setCooldown(30);
    };

    return (
        <div className="flex h-screen">
            <ToastContainer />
            <div className="bg-orange-200 w-[480px] flex items-center justify-center rounded-r-xl">
                <div className="text-9xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">Z</div>
            </div>
            <motion.div 
                className="bg-white w-2/3 p-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-bold mb-2">OTP has been sent to your email</h1>
                <p className="mb-4 text-orange-400">OTP is only valid for 1 min Please enter before that</p>

                <div className="flex items-center mb-4">
                    <input
                        placeholder="Enter OTP here"
                        className="w-1/4 border border-gray-300 rounded-lg p-2"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </div>

                <p className="text-gray-500 mb-4">
                    {cooldown > 0 ? `Resend after ${cooldown} seconds` : ''} 
                </p>

                <div className="flex space-x-4">
                    <PrimaryBtn
                        text="Verify"
                        onClick={handleVerifyOtp}
                        className="bg-orange-400 hover:bg-orange-500 transition-all duration-200 text-white text-xl font-bold py-2 px-6 rounded-lg"
                    />
                    <PrimaryBtn
                        text="Resend"
                        onClick={handleResendOtp}
                        disabled={cooldown > 0}
                        className={`bg-orange-400 hover:bg-orange-500 transition-all duration-200 text-white text-xl font-bold py-2 px-6 rounded-lg ${cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Otp;