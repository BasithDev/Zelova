import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useState, useRef } from 'react';
import Croppie from 'react-cropper';
import "cropperjs/dist/cropper.css"; // Make sure to import the Croppie styles

const EditUserPop = () => {
  const userData = useSelector((state) => state.userData.data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null); // Store image to be cropped
  const [croppedImage, setCroppedImage] = useState(null); // Store final cropped image
  const croppieRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Create a temporary URL for the selected image
      setIsModalOpen(true);
    }
  };

  const handleSaveCroppedImage = () => {
    if (croppieRef.current) {
      croppieRef.current.result({ type: 'base64', size: 'viewport' }).then((croppedBase64) => {
        setCroppedImage(croppedBase64);
        setIsModalOpen(false); // Close modal after saving
      });
    }
  };

  const handleCancelCrop = () => {
    setIsModalOpen(false); // Close modal without saving
  };

  const initializeCroppie = (node) => {
    if (node && image && !croppieRef.current) {
      croppieRef.current = new Croppie(node, {
        viewport: { width: 200, height: 200, type: 'circle' }, // Crop in circle shape
        boundary: { width: 300, height: 300 },
        enableZoom: true,
      });
      croppieRef.current.bind({ url: image });
    }
  };

  return (
    <div className="mx-5 my-2 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-center mb-4">Edit Profile</h2>
      <div className="flex flex-col items-center mb-6 space-y-4">
        <img
          src={croppedImage ?? userData.profilePicture ?? "https://placehold.co/100x100"}
          alt="Profile"
          className="w-48 h-48 rounded-full border border-gray-300 object-cover"
        />

        <div className="flex space-x-4">
          <button
            className="bg-orange-500 flex items-center gap-1 px-4 py-2 text-white font-semibold rounded hover:bg-orange-600"
            onClick={() => document.getElementById('fileInput').click()} // Trigger file input
          >
            <FiEdit />
            Edit
          </button>
          <button className="bg-red-500 flex items-center gap-1 px-4 py-2 text-white font-semibold rounded hover:bg-red-700">
            <FiTrash2 />
            Remove
          </button>
        </div>

        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={handleImageUpload}
        />
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

      {/* Other fields... */}

      <div className="mt-4">
        <button className="w-full px-4 py-2 bg-orange-500 text-white font-bold text-2xl rounded-lg hover:bg-orange-600 transition-all duration-300">
          Update
        </button>
      </div>

      {/* Modal for Cropping Image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-2xl font-semibold text-center mb-4">Crop Image</h3>
            <div ref={initializeCroppie} className="croppie-container mb-4"></div>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleCancelCrop}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleSaveCroppedImage}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUserPop;
