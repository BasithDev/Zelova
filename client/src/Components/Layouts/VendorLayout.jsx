import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../Services/apiServices";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from 'react-redux';
import { logoutUser } from "../../Redux/slices/authUserSlice";
import PropTypes from 'prop-types'
import { MdHome , MdPerson ,MdRestaurant,MdReceiptLong} from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { IoFastFoodOutline } from "react-icons/io5";
import { BiFoodMenu } from "react-icons/bi";

const NavItem = ({ icon: Icon, label, route }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = location.pathname === route;
    return (
        <div
            onClick={() => navigate(route)}
            className={`flex items-center gap-3 cursor-pointer p-3 mx-4 rounded-lg transition-all 
                ${isActive ? 'bg-orange-400 text-white hover:bg-orange-500' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'} hover:scale-105`}
        >
            <Icon className="text-2xl" />
            <p className="text-lg font-semibold">{label}</p>
        </div>
    );
};

const VendorLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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
        <div className="flex h-screen">
            <aside className="w-1/5 fixed h-full bg-gray-100 text-center shadow-lg flex flex-col justify-between">
                <div>
                    <p className="text-5xl font-semibold mt-6 mb-10 text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text cursor-pointer">
                        Zelova<span className="ms-1 text-xl text-green-600">Kitchen</span>
                    </p>
                    <nav className="space-y-6">
                        <NavItem icon={MdHome} label="Home" route="/vendor" />
                        <NavItem icon={MdReceiptLong} label="Orders" route="/vendor/orders" />
                        <NavItem icon={MdRestaurant} label="Manage Restaurant" route="/vendor/manage-restaurant" />
                        <NavItem icon={IoFastFoodOutline} label="Add Items" route="/vendor/add-items" />
                        <NavItem icon={BiFoodMenu} label="Menu" route="/vendor/menu" />
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
                className="text-lg  font-semibold text-blue-600"
                variants={{
                    hover: { x: "50%" },
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
            <main className="w-full ml-[20%]">
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
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
NavItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,    
    route: PropTypes.string.isRequired       
};
export default VendorLayout;