import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LuUsers } from "react-icons/lu";
import { MdDashboard, MdShoppingBasket, MdLocalOffer, MdEmail } from "react-icons/md";
import { FaStoreAlt, FaClipboardList } from 'react-icons/fa';
import { HiOutlineLogout } from 'react-icons/hi';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch} from "react-redux";
import { logout } from "../../Services/apiServices";
import { logoutAdmin } from "../../Redux/slices/admin/authAdminSlice";
import { fetchAdminData } from "../../Redux/slices/admin/adminDataSlice";
const navItems = [
  { name: "Dashboard", icon: <MdDashboard className="text-3xl" />, path: "/admin" },
  { name: "Users", icon: <LuUsers className="text-3xl" />, path: "/admin/user-manage" },
  { name: "Vendors", icon: <FaStoreAlt className="text-3xl" />, path: "/admin/vendor-manage" },
  { name: "Items", icon: <MdShoppingBasket className="text-3xl" />, path: "/admin/items" },
  { name: "Details", icon: <FaClipboardList className="text-3xl" />, path: "/admin/details" },
  { name: "Coupons", icon: <MdLocalOffer className="text-3xl" />, path: "/admin/coupon-manage" },
  { name: "Send Mail", icon: <MdEmail className="text-3xl" />, path: "/admin/send-mail" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  
  useEffect(() => {
    dispatch(fetchAdminData());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      const role = "admin";
      await logout(role);
      dispatch(logoutAdmin());
      navigate("/admin/login");
    } catch (error) {
      console.log(error);
    }
  };

  const isActive = (path) => location.pathname === path ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600";

  return (
    <div className="flex h-screen w-full">
      <aside className="w-[15%] hide-scrollbar h-screen overflow-y-auto left-0 top-0 p-5 bg-gray-800 text-white shadow-lg">
        <div className="text-center mb-10">
          <p className="text-orange-400 font-bold text-3xl">
            Zelova <span className="text-blue-500 text-xl">Admin</span>
          </p>
        </div>

        {navItems.map(({ name, icon, path }) => (
          <div
            key={name}
            onClick={() => navigate(path)}
            className={`flex items-center gap-4 px-4 py-3 rounded-md cursor-pointer mt-5 transition-all duration-200 ${isActive(path)}`}
          >
            {icon}
            <p className="text-xl font-medium">{name}</p>
          </div>
        ))}

        <div
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-4 px-4 py-3 mt-5 cursor-pointer transition-all duration-200 bg-gray-300 hover:bg-gray-400 rounded-md"
        >
          <HiOutlineLogout className="text-3xl text-gray-500" />
          <p className="text-xl text-gray-500 font-medium">Logout</p>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto">
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
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
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

export default AdminLayout;