
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import EditUserPop from '../../Components/PopUps/EditUserPop';
import { useState } from 'react';

const EditUser = () => {
  const userData = useSelector((state)=>state.userData.data)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  return (
    <div className=" mx-5 my-2 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-center mb-4">Edit Profile</h2>
      <div className="flex flex-col items-center mb-6 space-y-4">
        <img
          src={userData.profilePicture ?? "https://placehold.co/100x100"}
          alt="Profile"
          className="w-48 h-48 rounded-full border border-gray-300 object-cover"
        />

        <div className="flex space-x-4">
          <button 
          onClick={handleOpenModal}
          className="bg-orange-500 flex items-center gap-1 px-4 py-2 text-white font-semibold rounded hover:bg-orange-600">
            <FiEdit />
            Edit
          </button>
          <button className="bg-red-500 flex items-center gap-1 px-4 py-2 text-white font-semibold rounded hover:bg-red-700">
            <FiTrash2 />
            Remove
          </button>
        </div>

        <input type="file" className="hidden" />
      </div>

      <div className="mb-4">
        <label className="block text-xl font-semibold text-orange-600 mb-2">Username</label>
        <input
          type="text"
          value={userData.fullname}
          placeholder="Enter your fullname"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xl font-semibold text-orange-600 mb-2">Phone Number</label>
        <input
          type="tel"
          value={userData.phoneNumber}
          placeholder="Enter your number"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xl font-semibold text-orange-600 mb-2">Age</label>
        <input
          type="number"
          value={userData.age}
          placeholder="Enter your Age"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xl font-semibold text-orange-600 mb-2">Email</label>
        <input
          type="email"
          value={userData.email}
          placeholder="Enter your email"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send OTP
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-xl font-semibold text-orange-600 mb-2">Enter OTP</label>
        <input
        disabled={true}
          type="text"
          placeholder='Enter the OTP'
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition duration-200"
        />
        <button
        disabled={true}
          className=" mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Verify OTP
        </button>
      </div>

      <div className="mt-4">
        <button
          className="w-full px-4 py-2 bg-orange-500 text-white font-bold text-2xl rounded-lg hover:bg-orange-600 transition-all duration-300"
        >
          Update
        </button>
      </div>
      {isModalOpen && <EditUserPop closeModal={handleCloseModal} />}
    </div>
  );
};

export default EditUser;