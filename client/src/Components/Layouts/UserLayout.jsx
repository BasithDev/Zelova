import { Outlet, useNavigate } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { FaHeart, FaUser } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { IoMdLogOut } from "react-icons/io";
import { useState, useEffect } from "react";
import { logout } from "../../Services/apiServices";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../../Redux/slices/authUserSlice";
import { fetchUserData } from '../../Redux/slices/userDataSlice'
import Cookies from 'js-cookie';

const UserLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const userID = useSelector((state) => state.authUser.userId);

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

    useEffect(() => {
        async function funTrigger() {
            const userId = userID;
            await dispatch(fetchUserData(userId));
        }
        funTrigger();
    }, [dispatch, userID]);

    const userData = useSelector((state) => state.userData.data);
    if (!userData) return <>loading ..</>;

    const isVendor = userData?.isVendor || null;
    if (isVendor) {
        Cookies.set('is_vendor', 'true');
    }

    return (
        <div className="flex">
            <aside className="bg-gray-100 w-1/5 fixed text-center shadow-lg h-screen flex flex-col justify-between">
                <div>
                    <p className="text-5xl font-semibold mt-3 mb-5 text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text cursor-pointer">
                        Zelova
                    </p>
                    <nav className="space-y-4">
                        <div
                            onClick={() => navigate('/')}
                            className="flex items-center gap-3 cursor-pointer p-3 mx-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            <MdHome className="text-2xl text-gray-500" />
                            <p className="text-lg font-semibold text-gray-500">Home</p>
                        </div>
                        <div
                            onClick={() => navigate('/favourites')}
                            className="flex items-center gap-3 cursor-pointer p-3 mx-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            <FaHeart className="text-2xl text-gray-500" />
                            <p className="text-lg font-semibold text-gray-500">Favourites</p>
                        </div>
                        <div
                            onClick={() => navigate('/orders')}
                            className="flex items-center gap-3 cursor-pointer p-3 mx-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            <BiSolidPurchaseTag className="text-2xl text-gray-500" />
                            <p className="text-lg font-semibold text-gray-500">Orders</p>
                        </div>
                        <div
                            onClick={() => navigate('/coins')}
                            className="flex items-center gap-3 cursor-pointer p-3 mx-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            <p className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">Z</p>
                            <p className="text-lg font-semibold text-gray-500">Coins</p>
                        </div>
                        <div
                            onClick={() => navigate('/share-supplies')}
                            className="flex items-center gap-3 cursor-pointer p-3 mx-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            <img src="/src/assets/shareSup.png" alt="" className="w-6" />
                            <p className="text-lg font-semibold text-gray-500">Share Supplies</p>
                        </div>
                        <div
                            onClick={() => navigate('/get-supplies')}
                            className="flex items-center gap-3 cursor-pointer p-3 mx-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            <img src="/src/assets/searchLove.png" alt="" className="w-6" />
                            <p className="text-lg font-semibold text-gray-500">Get Supplies</p>
                        </div>
                        {isVendor && (
                            <div
                                onClick={() => navigate('/vendor')}
                                className="flex items-center cursor-pointer p-3 mx-4 bg-blue-200 rounded-lg hover:bg-blue-300 transition-all"
                            >
                                <p className="text-lg font-semibold text-blue-600">Switch to Vendor</p>
                            </div>
                        )}
                    </nav>
                </div>

                {/* Profile and Logout at the Bottom */}
                <div className="mb-3 mx-4 space-y-3">
                    <div
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-3 cursor-pointer p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                    >
                        {userData.profilePicture ? (
                            <img src={userData.profilePicture} alt="Profile" className="rounded-full w-8 h-8" />
                        ) : (
                            <FaUser className="text-2xl text-gray-600 bg-gray-300 p-1 rounded-full" />
                        )}
                        <p className="font-semibold text-gray-700">{userData?.fullname}</p>
                    </div>

                    <div
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center justify-center gap-2 cursor-pointer p-3 border-2 border-red-500 text-red-600 rounded-lg transition-all hover:bg-red-100"
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

export default UserLayout;