import { FaEdit, FaKey, FaStore, FaPalette, FaAddressCard, FaUserEdit, FaExclamationTriangle } from "react-icons/fa";
import PropTypes from "prop-types";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate()
const userData = useSelector((state)=>state.userData.data)
  return (
    <div className="flex bg-slate-50 items-center justify-center min-h-screen">
      <div className="bg-white rounded-xl p-8 w-full max-w-4xl text-center shadow-2xl transition-transform transform">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Your Profile</h1>
        
        <div className="flex flex-col items-center mb-8">
          <img
          referrerPolicy="no-referrer"
            src={userData?.profilePicture || "https://placehold.co/100x100"}
            alt="Profile of Abdul Basith"
            className="rounded-full w-32 h-32 mb-4 border-4 transition-all duration-300 border-blue-500 shadow-xl hover:shadow-2xl"
          />
          <h2 className="text-3xl font-semibold text-gray-700">{userData?.fullname}</h2>
          <p className="text-gray-400 mb-6 text-lg">{userData?.email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <ProfileOption 
          onClick={()=>navigate('/edit-user')}
          icon={<FaEdit />} color="text-orange-500" label="Edit Profile" />

          <ProfileOption 
          onClick={()=>navigate('/reset-password')}
          icon={<FaKey />} color="text-blue-500" label="Reset Password" />

          <ProfileOption 
          onClick={()=>navigate('/change-id')}
          icon={<FaUserEdit />} color="text-blue-500" label="Change ID" />
          {
            userData.isVendor ? 
            <ProfileOption 
            onClick={()=>navigate('/vendor')}
            icon={<FaStore />} color="text-green-500" label="Switch To Vendor" /> : 
            <ProfileOption 
            onClick={()=>navigate('/request-vendor')} 
            icon={<FaStore />} color="text-green-500" label="Become a Vendor" />
          }
          <ProfileOption icon={<FaPalette />} color="text-purple-500" label="Theme Preference" />
          <ProfileOption 
          onClick={()=>navigate('/address-manage')} 
          icon={<FaAddressCard />} color="text-orange-500" label="Your Addresses" />
          <ProfileOption 
          onClick={()=>navigate('/report')}
          icon={<FaExclamationTriangle />} color="text-red-500" label="Report a Problem" />
        </div>
      </div>
    </div>
  );
};

const ProfileOption = ({ icon, color, label , onClick }) => (
  <div 
  onClick={onClick}
  className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 hover:shadow-lg transition-all transform hover:scale-105">
    <div className={`${color} text-2xl mr-4`}>{icon}</div>
    <span className="text-gray-700 font-medium">{label}</span>
  </div>
);

ProfileOption.propTypes = {
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default Profile;