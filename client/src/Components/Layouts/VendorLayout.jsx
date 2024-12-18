import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../Services/apiServices";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from 'react-redux';
import { logoutUser } from "../../Redux/slices/user/authUserSlice";
import { fetchRestaurantData } from "../../Redux/slices/seller/restaurantDataSlice";

import { MdHome, MdPerson, MdRestaurant, MdReceiptLong } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { IoFastFoodOutline } from "react-icons/io5";
import { BiFoodMenu } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";

const VendorLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        dispatch(fetchRestaurantData());
    }, [dispatch]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const role = 'user';
            await logout(role);
            dispatch(logoutUser());
            navigate("/login");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen relative">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex bg-gray-100 h-screen w-[280px] fixed top-0 left-0 bottom-0 text-center shadow-lg flex-col justify-between overflow-y-auto">
                <div>
                    <p className="text-4xl lg:text-5xl font-semibold mt-3 mb-5 text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text cursor-pointer">
                        Zelova<span className="ms-1 text-xl text-green-600">Kitchen</span>
                    </p>
                    <nav className="space-y-4">
                        {/* Desktop Navigation Items */}
                        <div onClick={() => navigate('/vendor')} className={`flex items-center gap-3 hover:scale-105 cursor-pointer p-3 mx-4 rounded-lg transition-all ${location.pathname === '/vendor' ? 'bg-orange-400 text-white hover:bg-orange-500' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>
                            <MdHome className="text-2xl" />
                            <p className="text-lg font-semibold">Home</p>
                        </div>
                        <div onClick={() => navigate('/vendor/orders')} className={`flex items-center gap-3 hover:scale-105 cursor-pointer p-3 mx-4 rounded-lg transition-all ${location.pathname === '/vendor/orders' ? 'bg-orange-400 text-white hover:bg-orange-500' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>
                            <MdReceiptLong className="text-2xl" />
                            <p className="text-lg font-semibold">Orders</p>
                        </div>
                        <div onClick={() => navigate('/vendor/menu')} className={`flex items-center gap-3 hover:scale-105 cursor-pointer p-3 mx-4 rounded-lg transition-all ${location.pathname === '/vendor/menu' ? 'bg-orange-400 text-white hover:bg-orange-500' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>
                            <BiFoodMenu className="text-2xl" />
                            <p className="text-lg font-semibold">Menu</p>
                        </div>
                        <div onClick={() => navigate('/vendor/manage-restaurant')} className={`flex items-center gap-3 hover:scale-105 cursor-pointer p-3 mx-4 rounded-lg transition-all ${location.pathname === '/vendor/manage-restaurant' ? 'bg-orange-400 text-white hover:bg-orange-500' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>
                            <MdRestaurant className="text-2xl" />
                            <p className="text-lg font-semibold">Manage Restaurant</p>
                        </div>
                        <div onClick={() => navigate('/vendor/add-items')} className={`flex items-center gap-3 hover:scale-105 cursor-pointer p-3 mx-4 rounded-lg transition-all ${location.pathname === '/vendor/add-items' ? 'bg-orange-400 text-white hover:bg-orange-500' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>
                            <IoFastFoodOutline className="text-2xl" />
                            <p className="text-lg font-semibold">Add Items</p>
                        </div>
                        <motion.div
                            onClick={() => navigate('/')}
                            className="flex hover:scale-105 items-center cursor-pointer p-3 mx-4 bg-blue-200 rounded-lg transition-all duration-300 hover:bg-blue-300"
                            whileHover="hover"
                        >
                            <motion.p
                                className="text-lg font-semibold text-blue-600"
                                variants={{
                                    hover: { opacity: 0 },
                                }}
                                transition={{ type: "tween", duration: 0.4 }}
                            >
                                <MdPerson className="text-xl text-blue-600 mr-2" />
                            </motion.p>
                            <motion.p
                                className="text-lg font-semibold text-blue-600"
                                variants={{
                                    hover: {
                                        scale: 1.1,
                                        fontWeight: 600,
                                    },
                                }}
                                transition={{ type: "tween", duration: 0.4 }}
                            >
                                Switch to User
                            </motion.p>
                        </motion.div>
                    </nav>
                </div>
                <div className="mb-6 mx-4">
                    <div
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center justify-center gap-2 cursor-pointer p-3 mt-3 border-2 border-red-500 text-red-600 rounded-lg transition-all hover:scale-105 hover:bg-red-100"
                    >
                        <p className="font-semibold">Logout</p>
                        <IoMdLogOut className="text-xl" />
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 w-full bg-white shadow-md z-50 p-4">
                <p className="text-2xl lg:text-3xl font-bold text-left text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text">
                    Zelova<span className="ms-1 text-sm font-extrabold text-green-600">Kitchen</span>
                </p>
            </div>

            {/* Main Content */}
            <main className="lg:ml-[280px] flex-1 mt-16 lg:mt-0 mb-20 lg:mb-0">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 w-full bg-white shadow-lg z-50">
                <div className="flex justify-around items-center p-3">
                    <div
                        onClick={() => navigate('/vendor')}
                        className={`flex flex-col items-center ${location.pathname === '/vendor' ? 'text-orange-500' : 'text-gray-500'}`}
                    >
                        <MdHome className="text-2xl" />
                        <span className="text-xs mt-1">Home</span>
                    </div>
                    <div
                        onClick={() => navigate('/vendor/orders')}
                        className={`flex flex-col items-center ${location.pathname === '/vendor/orders' ? 'text-orange-500' : 'text-gray-500'}`}
                    >
                        <MdReceiptLong className="text-2xl" />
                        <span className="text-xs mt-1">Orders</span>
                    </div>
                    <div
                        onClick={() => navigate('/vendor/menu')}
                        className={`flex flex-col items-center ${location.pathname === '/vendor/menu' ? 'text-orange-500' : 'text-gray-500'}`}
                    >
                        <BiFoodMenu className="text-2xl" />
                        <span className="text-xs mt-1">Menu</span>
                    </div>
                    <div className="relative">
                        <div
                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                            className={`flex flex-col items-center ${
                                location.pathname === '/vendor/add-items' || 
                                location.pathname === '/vendor/manage-restaurant' || 
                                showMoreMenu 
                                    ? 'text-orange-500' 
                                    : 'text-gray-500'
                            }`}
                        >
                            <BsThreeDots className="text-2xl" />
                            <span className="text-xs mt-1">More</span>
                        </div>
                        
                        {/* More Menu Dropdown */}
                        <AnimatePresence>
                            {showMoreMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute bottom-full right-[-8px] mb-2 bg-white rounded-lg shadow-lg z-50 min-w-[220px] overflow-hidden"
                                >
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-4 border-b"
                                    >
                                        <p className="font-semibold text-gray-700">Additional Options</p>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="p-2"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                navigate('/vendor/manage-restaurant');
                                                setShowMoreMenu(false);
                                            }}
                                            className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg ${
                                                location.pathname === '/vendor/manage-restaurant'
                                                    ? 'bg-orange-100 text-orange-500'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            <MdRestaurant className="text-xl" />
                                            <span>Manage Restaurant</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                navigate('/vendor/add-items');
                                                setShowMoreMenu(false);
                                            }}
                                            className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg ${
                                                location.pathname === '/vendor/add-items'
                                                    ? 'bg-orange-100 text-orange-500'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            <IoFastFoodOutline className="text-xl" />
                                            <span>Add Items</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                navigate('/');
                                                setShowMoreMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-gray-100"
                                        >
                                            <MdPerson className="text-xl text-blue-600" />
                                            <span className="text-blue-600">Switch to User</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setShowLogoutConfirm(true);
                                                setShowMoreMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-50"
                                        >
                                            <IoMdLogOut className="text-xl" />
                                            <span>Logout</span>
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4"
                        >
                            <h3 className="text-xl font-semibold mb-4">Confirm Logout</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    disabled={isLoggingOut}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
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