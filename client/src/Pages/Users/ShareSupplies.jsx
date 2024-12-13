import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../Components/Common/Header';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { shareSupplies, viewSharedSupplies, updateSupplies, deleteSupplies } from '../../Services/apiServices';
import { CircleLoader } from 'react-spinners';
import { useSelector } from 'react-redux';

const ShareSupplies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [supplies, setSupplies] = useState([]);
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const userLocation = useSelector((state) => state?.userLocation.coordinates);
  const [lat, lon] = userLocation ? Object.values(userLocation) : [0, 0];
  const [editData, setEditData] = useState({
    heading: '',
    description: '',
    contactNumber: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      setLoading(true);
      const response = await viewSharedSupplies();
      setSupplies(response.data.sharedSupplies);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching supplies');
    } finally {
      setLoading(false);
    }
  };

  const validateContactNumber = (number) => {
    const regex = /^[0-9]{10}$/; // Assuming a 10-digit phone number
    return regex.test(number);
  };

  const handleShare = async () => {
    try {
      if (!heading || !description || !contactNumber) {
        toast.warning('Please fill in all fields');
        return;
      }

      if (!validateContactNumber(contactNumber)) {
        toast.warning('Please enter a valid 10-digit contact number');
        return;
      }

      setLoading(true);
      const response = await shareSupplies({
        heading,
        description,
        contactNumber,
        lat,
        lon
      });

      toast.success('Supply shared successfully!');
      setSupplies([response.data.supply, ...supplies]);
      setHeading('');
      setDescription('');
      setContactNumber('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sharing supply');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteSupplies(id);
      setSupplies(supplies.filter(supply => supply._id !== id));
      toast.success('Supply deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting supply');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const supplyToEdit = supplies.find((supply) => supply._id === id);
    setEditData({
      id: supplyToEdit._id,
      heading: supplyToEdit.heading,
      description: supplyToEdit.description,
      contactNumber: supplyToEdit.contactNumber
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      if (!editData.heading || !editData.description || !editData.contactNumber) {
        toast.warning('Please fill in all fields');
        return;
      }

      setLoading(true);
      const response = await updateSupplies({
        supplyId: editData.id,
        heading: editData.heading,
        description: editData.description,
        contactNumber: editData.contactNumber
      });

      setSupplies(supplies.map(supply => 
        supply._id === editData.id ? response.data.supply : supply
      ));
      
      setIsEditModalOpen(false);
      toast.success('Supply updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating supply');
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = (supply) => {
    setSelectedSupply(supply);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupply(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        placeholderText="Search foods, restaurants, etc..."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
            Share Your Supplies
          </h1>
          <p className="mt-2 sm:mt-4 text-lg sm:text-xl text-gray-600">Help others by sharing your supplies and resources</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-base sm:text-lg font-medium text-gray-700 mb-2">Heading</label>
                <input
                  type="text"
                  placeholder="What supplies are you sharing?"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-base sm:text-lg font-medium text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  placeholder="Enter your contact number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-base sm:text-lg font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Provide details about your supplies..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 h-32 resize-none placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleShare}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 sm:py-4 rounded-xl font-medium text-base sm:text-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <CircleLoader size={20} color="#ffffff" />
                ) : (
                  'Share Supplies'
                )}
              </button>
            </div>
          </div>

          {/* Supplies List Section */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Your Shared Supplies</h2>
            <div className="overflow-y-auto max-h-[60vh] sm:max-h-[65vh] pr-2">
              <div className="space-y-3">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <CircleLoader size={40} color="#FF5733" />
                  </div>
                ) : supplies.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No supplies shared yet</p>
                ) : (
                  supplies.map((supply) => (
                    <motion.div
                      key={supply._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-4 relative group hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => handleShowDetails(supply)}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 pr-16">{supply.heading}</h3>
                          <div className="flex gap-2 absolute top-3 right-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(supply._id);
                              }}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(supply._id);
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{supply.description}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-500">
                          <p className="flex items-center gap-1">
                            <span className="font-medium">Contact:</span>
                            {supply.contactNumber}
                          </p>
                          <div className="hidden sm:block text-gray-300">•</div>
                          <p>Posted: {new Date(supply.createdAt).toLocaleString()}</p>
                          {supply.updatedAt && supply.updatedAt !== supply.createdAt && (
                            <>
                              <div className="hidden sm:block text-gray-300">•</div>
                              <p className="italic">Edited: {new Date(supply.updatedAt).toLocaleString()}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedSupply && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Supply Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Heading</h3>
                  <p className="mt-1 text-lg text-gray-800">{selectedSupply.heading}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                  <p className="mt-1 text-lg text-gray-800">{selectedSupply.contactNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-lg text-gray-800">{selectedSupply.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Posted</h3>
                  <p className="mt-1 text-gray-800">{new Date(selectedSupply.createdAt).toLocaleString()}</p>
                </div>
                {selectedSupply.updatedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Edited</h3>
                    <p className="mt-1 text-gray-800">{new Date(selectedSupply.updatedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={closeModal}
                className="mt-8 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-medium shadow-lg transition-all duration-300"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Edit Supply</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Heading</label>
                  <input
                    type="text"
                    value={editData.heading}
                    onChange={(e) => setEditData({ ...editData, heading: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    value={editData.contactNumber}
                    onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 h-40 resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  >
                    Update Supply
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareSupplies;