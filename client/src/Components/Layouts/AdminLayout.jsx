import { Outlet, useNavigate } from "react-router-dom"
import { LuUsers } from "react-icons/lu";
import { MdDashboard } from "react-icons/md";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from 'react-redux';
import { logout } from "../../Services/apiServices";
import {logoutAdmin} from '../../Redux/slices/authSlice'

const AdminLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      const role = 'admin'
      await logout(role)
      dispatch(logoutAdmin());
      navigate("/admin/login");
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="flex">
    <aside className="w-1/5 fixed border-r-2 h-screen p-2">
      <div className="text-center">
        <p className="text-orange-400 font-bold text-3xl">Zelova <span className="text-blue-500 text-xl">Admin</span></p>
      </div>
      <div 
      onClick={()=>navigate('/admin')}
      className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-md mt-3 cursor-pointer">
        <MdDashboard className="text-3xl" />
        <p className="text-3xl font-semibold">Dashboard</p>
      </div>
      <div
      onClick={()=>navigate('/admin/user-manage')}
      className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Users</p>
      </div>
      <div 
      onClick={()=>navigate('/admin/vendor-manage')}
      className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Vendors</p>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Items</p>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Details</p>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Coupon</p>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Send Mail</p>
      </div>
      <div 
      onClick={()=>navigate('/admin/profile')}
      className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Profile</p>
      </div>
      <div 
      onClick={() => setShowLogoutConfirm(true)}
      className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Logout</p>
      </div>
      
    </aside>

    <main className="ml-[20%] w-4/5">
      <Outlet/>
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

export default AdminLayout