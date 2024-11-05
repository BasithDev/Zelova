import { useState,useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FcShop } from "react-icons/fc";
import { FcBusinessman } from "react-icons/fc";
import { IoIosCloseCircle } from "react-icons/io";
import PrimaryBtn from '../../Components/Buttons/PrimaryBtn';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserAuth } from '../../Redux/slices/authSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showRolePopup, setShowRolePopup] = useState(false);
    const [token, setToken] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('isVendor') === 'true') {
            setShowRolePopup(true);
        }
    }, [location]);

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3000/api/user/auth/login',
                { email, password },
                { withCredentials: true }
            );
            const { token, isVendor } = response.data;
            setToken(token)

            if (isVendor) {
                setShowRolePopup(true);
            } else {
                dispatch(setUserAuth({ token }));
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data.message || "Server error. Please try again later.");
            console.error("Login error:", error);
        }
    };

    const handleRoleSelection = (role) => {
        setShowRolePopup(false);
        if (role === 'vendor') {
            console.log('working')
            dispatch(setUserAuth({ token }));
            navigate('/vendor/additem');
        } else {
            dispatch(setUserAuth({ token }));
            navigate('/');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/api/user/auth/google';
    };

    return (
        <div className="flex h-screen">
            <ToastContainer position="top-right" />
            <div className="bg-orange-200 w-[480px] flex items-center justify-center rounded-r-xl">
                <div className="text-9xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">Z</div>
            </div>
            <motion.div 
                className="w-2/3 flex flex-col justify-center items-center bg-white p-8 rounded-l-lg shadow-lg"
                initial={{ opacity: 0, scale:0.95 }}
                animate={{ opacity: 1, scale:1 }}
                exit={{ opacity: 0, scale:0.95 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
                <p className="text-gray-500 mb-8">Please sign in to your account to continue</p>
                <div className="w-1/2 mb-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-orange-200 p-3.5 rounded-l-lg">
                            <FaUser className="text-orange-500" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Email ID" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-[9px] border border-gray-300 rounded-r-lg focus:outline-none bg-white bg-opacity-50" 
                        />
                    </div>
                    <div className="flex items-center mb-4">
                        <div className="bg-orange-200 p-3.5 rounded-l-lg">
                            <RiLockPasswordFill className="text-orange-500" />
                        </div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-[9px] border border-gray-300 rounded-r-lg focus:outline-none bg-white bg-opacity-50" 
                        />
                    </div>
                    <div className="flex justify-center mb-4">
                        <a href="#">Forgot Password? <span className="underline text-blue-500">Click Here</span></a>
                    </div>
                    <PrimaryBtn 
                        text="Login" 
                        onClick={handleLogin} 
                        className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white text-2xl font-bold py-2 rounded-lg mb-4" 
                    />
                    <div className="flex items-center mb-4">
                        <hr className="w-full border-gray-300" />
                        <span className="px-2 text-gray-500">OR</span>
                        <hr className="w-full border-gray-300" />
                    </div>
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white border border-gray-300 hover:bg-gray-100 transition-all duration-200 text-gray-700 py-2 rounded-lg flex items-center justify-center mb-4">
                        <FcGoogle className="mr-2 text-2xl" />
                        Sign In Using Google Account
                    </button>
                    <div className="text-center">
                        <span className="text-gray-500">Create New Account? </span>
                        <Link to={'/register'}><span className="text-blue-500 underline">Sign Up</span></Link>
                    </div>
                </div>
                <AnimatePresence>
                {showRolePopup && (
                    
                    <motion.div 
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    initial={{ opacity: 0  }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-center relative">
                    <IoIosCloseCircle 
                    onClick={() => setShowRolePopup(false)}
                    className='absolute top-3 right-3 text-3xl text-red-600'
                    />
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Choose Your Role</h2>
                        <p className="text-gray-500 mb-6">Do you want to continue as a Vendor or User?</p>
                        <div className="flex items-center justify-around space-x-6">
                            <button 
                                onClick={() => handleRoleSelection('vendor')} 
                                className="flex flex-col items-center bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:from-green-500 hover:to-green-600 transition-all duration-200"
                            >
                                <FcShop className="text-4xl mb-1" />
                                <span className="font-medium">Vendor</span>
                            </button>
                            <button 
                                onClick={() => handleRoleSelection('user')} 
                                className="flex flex-col items-center bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition-all duration-200"
                            >
                                <FcBusinessman className="text-4xl mb-1" />
                                <span className="font-medium">User</span>
                            </button>
                        </div>
                    </div>
                </motion.div>                
                )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default Login;
