import { Outlet, useNavigate } from "react-router-dom"
import { MdHome } from "react-icons/md";
import { FaHeart, FaUser } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { IoMdLogOut } from "react-icons/io";
import { useState } from "react";
import { logout } from "../../Services/apiServices";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from 'react-redux';
import { logoutUser } from "../../Redux/slices/authSlice";
const UserLayout = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = async () => {
        try {
          const role = 'user'
          await logout(role)
          dispatch(logoutUser());
          navigate("/admin/login");
        } catch (error) {
            console.log(error)
        }
      };
    return (
        <div className="flex">
            <aside className="w-1/5 border-r-2 h-screen text-center">
                <p className="text-5xl font-semibold my-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 cursor-pointer">
                    Zelova
                </p>
                <div
                    onClick={() => navigate('/')}
                    className="flex cursor-pointer items-center gap-2 bg-gray-200 rounded-md my-4 mx-4 px-3 py-1 hover:bg-gray-300 transition-all">
                    <MdHome className="text-3xl text-gray-500" />
                    <p className="text-3xl font-semibold text-gray-500">Home</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 bg-gray-200 rounded-md my-4 mx-4 px-3 py-1 hover:bg-gray-300 transition-all">
                    <FaHeart className="text-2xl text-gray-500" />
                    <p className="text-3xl font-semibold text-gray-500">Favourites</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 bg-gray-200 rounded-md my-4 mx-4 px-3 py-1 hover:bg-gray-300 transition-all">
                    <BiSolidPurchaseTag className="text-2xl text-gray-500" />
                    <p className="text-3xl font-semibold text-gray-500">Orders</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 bg-gray-200 rounded-md my-4 mx-4 px-3 py-1 hover:bg-gray-300 transition-all">
                    <p className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">Z</p>
                    <p className="text-3xl font-semibold text-gray-500">Coins</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 bg-gray-200 rounded-md my-4 mx-4 px-3 py-1 hover:bg-gray-300 transition-all">
                    <img src="/src/assets/shareSup.png" alt="" className="w-6" />
                    <p className="text-2xl font-semibold text-gray-500">Share Supplies</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 bg-gray-200 rounded-md my-4 mx-4 px-3 py-1 hover:bg-gray-300 transition-all">
                    <img src="/src/assets/searchLove.png" alt="" className="w-6" />
                    <p className="text-2xl font-semibold text-gray-500">Get Supplies</p>
                </div>

                <div className="absolute bottom-0 w-64 p-4">
                    <div
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 rounded transition-all"
                    >
                        <FaUser className="text-4xl text-gray-600 bg-gray-300 p-2 rounded-full" />
                        <p className="font-semibold text-lg text-gray-700">Abdul Basith</p>
                    </div>

                    <div
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center justify-center gap-3 cursor-pointer p-2 mt-3 border-2 border-red-500 text-red-600 rounded transition-all hover:bg-red-100"
                    >
                        <p className="font-semibold text-lg">Logout</p>
                        <IoMdLogOut className="text-2xl" />
                    </div>
                </div>


            </aside>

            <main className="w-full">
                <Outlet />
            </main>

            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white p-5 rounded-lg shadow-lg text-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <h2 className="text-xl font-bold mb-4">Are you sure you want to log out?</h2>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)} // Close modal without logging out
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout} // Call the logout function
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Yes, Logout
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default UserLayout