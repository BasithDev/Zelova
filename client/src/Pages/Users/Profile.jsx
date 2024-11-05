import { FaTicketAlt, FaEdit, FaKey, FaStore, FaPalette, FaSignOutAlt } from "react-icons/fa";

const Profile = () => {
  return (
    <div className="flex items-center justify-center bg-gray-100 h-screen">
      <div className="bg-white rounded-lg p-8 w-full max-w-6xl text-center shadow-lg">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Your Profile</h1>
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://placehold.co/100x100"
            alt="Profile picture of a person sitting at a desk in an office"
            className="rounded-full w-32 h-32 mb-4 border-4 border-blue-500 shadow-md"
          />
          <h2 className="text-3xl font-semibold text-gray-700">Abdul Basith</h2>
          <p className="text-gray-400 mb-6 text-lg">@Z943#DFS321</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ProfileOption icon={<FaTicketAlt />} color="text-yellow-500" label="Coupons" />
          <ProfileOption icon={<FaEdit />} color="text-orange-500" label="Edit Profile" />
          <ProfileOption icon={<FaKey />} color="text-blue-500" label="Reset Password" />
          <ProfileOption icon={<FaStore />} color="text-green-500" label="Become a Vendor" />
          <ProfileOption icon={<FaPalette />} color="text-purple-500" label="Theme Preference" />
          <ProfileOption icon={<FaSignOutAlt />} color="text-red-500" label="Logout" />
        </div>
      </div>
    </div>
  );
};

const ProfileOption = ({ icon, color, label }) => (
  <div className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
    <div className={`${color} text-2xl mr-4`}>{icon}</div>
    <span className="text-gray-600 font-medium">{label}</span>
  </div>
);

export default Profile;
