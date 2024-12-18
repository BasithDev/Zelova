import { FaKey, FaEdit, FaPalette, FaEnvelopeOpenText, FaSignOutAlt } from "react-icons/fa";
import PropTypes from "prop-types";
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAdminData } from "../../Redux/slices/admin/adminDataSlice";
import { motion } from "framer-motion";

const Profile = () => {
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.adminData.data);
  const adminID = useSelector((state) => state.authAdmin.adminId);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchAdminData(adminID));
    }
  }, [dispatch, adminID]);

  if (!adminData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AdminSearchBar />
      <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.5 },
        y: { type: 'spring', stiffness: 100, damping: 20 },
    }}
      className="mt-10 rounded-xl shadow-2xl p-8 max-w-4xl mx-auto text-center">
        <div className="relative mb-6">
          <img
            src="https://placehold.co/100x100"
            alt="Admin Profile"
            className="rounded-full w-32 h-32 border-4 border-blue-500 mx-auto shadow-lg transition-all transform hover:shadow-xl"
          />
        </div>
        <h2 className="text-3xl font-semibold text-gray-800">{adminData.fullname}</h2>
        <p className="text-sm text-gray-500 mb-6">{adminData.email}</p>

        <div className="space-y-4">
          <ProfileOption icon={<FaKey />} color="text-blue-500" label="Reset Password" />
          <ProfileOption icon={<FaEdit />} color="text-orange-500" label="Edit Profile" />
          <ProfileOption icon={<FaPalette />} color="text-purple-500" label="Theme Preference" />
          <ProfileOption icon={<FaEnvelopeOpenText />} color="text-green-500" label="Requests" />
          <ProfileOption icon={<FaSignOutAlt />} color="text-red-500" label="Logout" />
        </div>
      </motion.div>
    </div>
  );
};

const ProfileOption = ({ icon, color, label }) => (
  <div className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out transform hover:scale-105">
    <div className={`${color} text-2xl mr-4`}>{icon}</div>
    <span className="text-gray-700 font-medium">{label}</span>
  </div>
);

ProfileOption.propTypes = {
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Profile;