import { Outlet, useNavigate } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaHotel, FaPlusSquare } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { AiOutlineAppstore } from "react-icons/ai"; // Added icon
import { useState } from "react";
import { logout } from "../../Services/apiServices";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from 'react-redux';
import { logoutUser } from "../../Redux/slices/authUserSlice";

const VendorLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = async () => {
        try {
            const role = 'user';
            await logout(role);
            dispatch(logoutUser());
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex h-screen">
            <aside className="w-1/5 fixed h-[100%] bg-gray-100 text-center shadow-lg flex flex-col justify-between">
                <div>
                    <p className="text-5xl font-semibold mt-6 mb-10 text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text cursor-pointer">
                        Zelova <span></span>
                    </p>

                    {/* Navigation Links */}
                    <nav className="space-y-6">
                        <div
                            onClick={() => navigate('/vendor')}
                            className="flex items-center gap-3 cursor-pointer p-3 mx-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            <MdHome className="text-2xl text-gray-500" />
                            <p className="text-lg font-semibold text-gray-500">Home</p>
                        </div>
                        <div
                            onClick={() => navigate('/vendor/orders')}
                            className="flex items-center gap-3 cursor-pointer p-3 mx-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            <BiSolidPurchaseTag className="text-2xl text-gray-500" />
                            <p className="text-lg font-semibold text-gray-500">Orders</p>
                        </div>
                        <div
                            onClick={() => navigate('/vendor/manage-hotel')}
                            className="flex items-center gap-3 cursor-pointer p-3 mx-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            <FaHotel className="text-2xl text-gray-500" />
                            <p className="text-lg font-semibold text-gray-500">Manage Hotel</p>
                        </div>
                        <div
                            onClick={() => navigate('/vendor/add-items')}
                            className="flex items-center gap-3 cursor-pointer p-3 mx-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            <FaPlusSquare className="text-2xl text-gray-500" />
                            <p className="text-lg font-semibold text-gray-500">Add Items</p>
                        </div>

                        {/* Products Page Button with Icon */}
                        <div
                            onClick={() => navigate('/vendor/products')}
                            className="flex items-center gap-3 cursor-pointer p-3 mx-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            <AiOutlineAppstore className="text-2xl text-gray-500" />
                            <p className="text-lg font-semibold text-gray-500">Products</p>
                        </div>

                        {/* Switch to User Option */}
                        <div
                            onClick={() => navigate('/')}
                            className="flex items-center gap-3 cursor-pointer p-3 mx-4 mt-2 bg-blue-200 rounded-lg hover:bg-blue-300 transition-all"
                        >
                            <p className="text-lg font-semibold text-blue-600">Switch to User</p>
                        </div>
                    </nav>
                </div>

                {/* Logout */}
                <div className="mb-6 mx-4">
                    <div
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center justify-center gap-2 cursor-pointer p-3 mt-3 border-2 border-red-500 text-red-600 rounded-lg transition-all hover:bg-red-100"
                    >
                        <p className="font-semibold">Logout</p>
                        <IoMdLogOut className="text-xl" />
                    </div>
                </div>
            </aside>

            <main className="w-full ms-[20%]">
                <Outlet />
            </main>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white p-6 rounded-lg shadow-lg text-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <h2 className="text-xl font-bold mb-4">Are you sure you want to log out?</h2>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
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
    );
};

export default VendorLayout;