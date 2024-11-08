import { FaKey, FaEdit, FaPalette, FaEnvelopeOpenText, FaSignOutAlt } from "react-icons/fa";
import PropTypes from "prop-types";
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";

const Profile = () => {
  return (
    <div className="bg-gray-100 h-screen">
      
      <AdminSearchBar/>

      <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-auto text-center shadow-md">
        <img
          src="https://placehold.co/100x100"
          alt="Admin Profile"
          className="rounded-full w-24 h-24 mb-4 border-4 border-blue-500 mx-auto"
        />
        <h2 className="text-2xl font-semibold text-gray-800">Max</h2>
        <p className="text-sm text-gray-500 mb-6">Admin</p>

        <div className="space-y-3">
          <ProfileOption icon={<FaKey />} color="text-blue-500" label="Reset Password" />
          <ProfileOption icon={<FaEdit />} color="text-orange-500" label="Edit Profile" />
          <ProfileOption icon={<FaPalette />} color="text-purple-500" label="Theme Preference" />
          <ProfileOption icon={<FaEnvelopeOpenText />} color="text-green-500" label="Requests" />
          <ProfileOption icon={<FaSignOutAlt />} color="text-red-500" label="Logout" />
        </div>
      </div>
    </div>
  );
};

const ProfileOption = ({ icon, color, label }) => (
  <div className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
    <div className={`${color} text-2xl mr-4`}>{icon}</div>
    <span className="text-gray-600 font-medium">{label}</span>
  </div>
);

ProfileOption.propTypes = {
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Profile;