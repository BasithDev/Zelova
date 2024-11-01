import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdAlternateEmail } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import PrimaryBtn from '../../Components/Buttons/PrimaryBtn'
const Register = () => {
    return (
        <div className="flex h-screen">
            <div className="bg-orange-200 w-[480px] flex items-center justify-center rounded-r-xl">
                <div className="text-9xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">Z</div>
            </div>
            <motion.div 
            className="flex flex-col justify-center w-2/3 p-10 bg-white"
            initial={{ opacity: 0, scale:0.95 }}
            animate={{ opacity: 1, scale:1 }}
            exit={{ opacity: 0, scale:0.95 }}
            transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold mb-2">Create an account</h1>
                <p className="text-gray-500 mb-6">Please Create a account to continue</p>
                <form className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="bg-orange-200 p-3.5 rounded-lg">
                            <FaUser className="text-orange-500" />
                        </div>
                        <input type="text" placeholder="FULL NAME" className="flex-1 p-2 border rounded-md" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="bg-orange-200 p-3.5 rounded-lg">
                            <MdAlternateEmail className="text-orange-500" />
                        </div>
                        <input type="email" placeholder="Email ID" className="flex-1 p-2 border rounded-md" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="bg-orange-200 p-3.5 rounded-lg">
                            <RiLockPasswordFill className="text-orange-500" />
                        </div>
                        <input type="password" placeholder="Password" className="flex-1 p-2 border rounded-md" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="bg-orange-200 p-3.5 rounded-lg">
                            <RiLockPasswordFill className="text-orange-500" />
                        </div>
                        <input type="password" placeholder="Confirm Password" className="flex-1 p-2 border rounded-md" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="bg-orange-200 p-3.5 rounded-lg">
                            <FaCalendarAlt className="text-orange-500" />
                        </div>
                        <input type="number" placeholder="Age" className="flex-1 p-2 border rounded-md" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="bg-orange-200 p-3.5 rounded-lg">
                            <FaPhoneAlt className="text-orange-500" />
                        </div>
                        <input type="text" placeholder="Mobile Number" className="flex-1 p-2 border rounded-md" />
                    </div>
                    <PrimaryBtn text="Sign Up" onClick={() => console.log("Logged")} className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 font-bold text-2xl text-white w-full py-2 rounded-md" />
                </form>
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <button className="bg-white border border-gray-300 hover:bg-gray-100 transition-all duration-200 text-gray-700 w-full py-2 rounded-md flex items-center justify-center">
                    <FcGoogle className="mr-2 text-2xl" />
                    Sign In Using Google Account
                </button>
                <Link to={'/login'}><p className="text-center text-gray-500 mt-4">Already registered ? <a href="#" className="text-blue-500">Sign In</a></p></Link>
            </motion.div>
        </div>
    )
}

export default Register