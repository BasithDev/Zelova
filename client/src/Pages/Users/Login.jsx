import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import PrimaryBtn from '../../Components/Buttons/PrimaryBtn';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setUserAuth } from '../../Redux/slices/user/authUserSlice';
import { loginUser } from '../../Services/apiServices';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await loginUser({ email, password });
            const { Id,token, isVendor } = response.data;
            const userId = Id
            if (isVendor) {
                await dispatch(setUserAuth({  userId,token, isVendor }));
                navigate('/role-select', { replace: true });
            } else {
                await dispatch(setUserAuth({  userId,token, isVendor }));
                navigate('/');
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/api/auth/google';
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full">
            <ToastContainer position="top-right" />
            
            <div className="bg-orange-200 w-full md:w-1/3 flex items-center justify-center rounded-none md:rounded-r-xl py-6 md:py-0">
                <div className="text-6xl md:text-9xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                    Z
                </div>
            </div>
            
            <motion.div
                className="w-full md:w-2/3 flex flex-col justify-center items-center h-screen bg-white p-6 md:p-8 rounded-none md:rounded-l-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome!</h1>
                <p className="text-gray-500 mb-4 md:mb-6">Please sign in to your account to continue</p>
                
                <div className="w-full max-w-sm px-4">
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
                    
                    <div className="text-center mb-4">
                        <a href="#" className="text-gray-500">Forgot Password? <span className="underline text-blue-500">Click Here</span></a>
                    </div>
                    
                    <PrimaryBtn
                        text="Login"
                        onClick={handleLogin}
                        className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white text-lg md:text-xl font-bold py-2 rounded-lg mb-4"
                    />
                    
                    <div className="flex items-center mb-4">
                        <hr className="w-full border-gray-300" />
                        <span className="px-2 text-gray-500">OR</span>
                        <hr className="w-full border-gray-300" />
                    </div>
                    
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white border border-gray-300 hover:bg-gray-100 transition-all duration-200 text-gray-700 py-2 rounded-lg flex items-center justify-center mb-4"
                    >
                        <FcGoogle className="mr-2 text-lg md:text-2xl" />
                        Sign In Using Google Account
                    </button>
                    
                    <div className="text-center">
                        <span className="text-gray-500">Create New Account? </span>
                        <Link replace to="/register">
                            <span className="text-blue-500 underline">Sign Up</span>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;