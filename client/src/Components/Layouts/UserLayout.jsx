import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { FaHeart, FaUser } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { IoMdLogOut } from "react-icons/io";
import { useState, useEffect } from "react";
import { logout } from "../../Services/apiServices";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../../Redux/slices/user/authUserSlice";
import { fetchUserData } from '../../Redux/slices/user/userDataSlice'
import Cookies from 'js-cookie';
import { MdStore } from "react-icons/md";

const UserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        dispatch(fetchUserData());
    }, [dispatch]);

    const userData = useSelector((state) => state.userData.data);

    const handleLogout = async () => {
        try {
            const role = 'user';
            dispatch(logoutUser());
            await logout(role);
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };
    if (!userData) return <>loading ..</>;
    const isVendor = userData?.isVendor || null;
    if (isVendor) {
        Cookies.set('is_vendor', 'true');
    }
    const navItems = [
        { path: '/', label: 'Home', icon: <MdHome /> },
        { path: '/favourites', label: 'Favourites', icon: <FaHeart /> },
        { path: '/orders', label: 'Orders', icon: <BiSolidPurchaseTag /> },
        { path: '/coins', label: 'Coins', icon: <p className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">Z</p> },
        { path: '/share-supplies', label: 'Share Supplies', icon: <img src="/src/assets/shareSup.png" alt="Share" className="w-6" /> },
        { path: '/get-supplies', label: 'Get Supplies', icon: <img src="/src/assets/searchLove.png" alt="Get" className="w-6" /> },
    ];
    const renderNavItem = ({ path, label, icon }) => (
        <div
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-3 hover:scale-105 cursor-pointer p-3 mx-4 rounded-lg transition-all ${
                location.pathname === path ? 'bg-orange-400 text-white hover:bg-orange-500' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            }`}
        >
            {icon}
            <p className="text-lg font-semibold">{label}</p>
        </div>
    );
    return (
        <div className="flex">
            <aside className="bg-gray-100 w-1/5 fixed text-center shadow-lg h-screen flex flex-col justify-between">
                <div>
                    <p className="text-5xl font-semibold mt-3 mb-5 text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text cursor-pointer">
                        Zelova
                    </p>
                    <nav className="space-y-4">
                        {navItems.map(renderNavItem)}
                        {isVendor && (
                            <motion.div
                            onClick={() => navigate('/vendor')}
                            className="flex hover:scale-105 items-center cursor-pointer p-3 mx-4 bg-blue-200 rounded-lg transition-all duration-300 hover:bg-blue-300"
                            whileHover="hover"
                        >
                            <motion.p
                                className="text-lg font-semibold text-blue-600"
                                variants={{
                                    hover: { opacity:0 },
                                }}
                                transition={{ type: "tween", duration: 0.2 }}
                            >
                                <MdStore className="text-xl text-blue-600 mr-2" />
                            </motion.p>

                            <motion.p
                                className="text-lg text-blue-600"
                                variants={{
                                    hover: {
                                        scale: 1.1,
                                        fontWeight: 600,
                                    },
                                }}
                                transition={{ type: "tween", duration: 0.2 }} 
                            >
                                Switch to Vendor
                            </motion.p>
                        </motion.div>
                        )}
                    </nav>
                </div>
                <div className="mb-3 mx-4 space-y-3">
                    <div
                        onClick={() => navigate('/profile')}
                        className={`flex items-center gap-3 cursor-pointer p-3 ${location.pathname === '/profile' ? 'bg-orange-400 hover:bg-orange-500':'bg-gray-200 hover:bg-gray-300'} hover:scale-105 rounded-lg transition-all`}
                    >
                        {userData.profilePicture ? (
                            <img src={userData.profilePicture} alt="Profile" className="rounded-full w-8 h-8" />
                        ) : (
                            <FaUser className="text-2xl text-gray-600 bg-gray-300 p-1 rounded-full" />
                        )}
                        <p className={`font-semibold ${location.pathname === '/profile' ? 'text-white' : 'text-gray-700'} `}>{userData?.fullname}</p>
                    </div>

                    <div
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex hover:scale-105 items-center justify-center gap-2 cursor-pointer p-3 border-2 border-red-500 text-red-600 rounded-lg transition-all hover:bg-red-100"
                    >
                        <p className="font-semibold">Logout</p>
                        <IoMdLogOut className="text-xl" />
                    </div>
                </div>
            </aside>
            <main className="w-full ms-[20%]">
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