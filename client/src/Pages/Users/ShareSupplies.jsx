import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../Components/Common/Header';

const ShareSupplies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [supplies, setSupplies] = useState([]);
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState(null);

  const handleShare = () => {
    const newSupply = {
      id: Date.now(),
      heading,
      description,
      createdAt: new Date().toLocaleString(),
      updatedAt: null,
    };
    setSupplies([...supplies, newSupply]);
    setHeading('');
    setDescription('');
  };

  const handleDelete = (id) => {
    setSupplies(supplies.filter((supply) => supply.id !== id));
  };

  const handleEdit = (id) => {
    const supplyToEdit = supplies.find((supply) => supply.id === id);
    setHeading(supplyToEdit.heading);
    setDescription(supplyToEdit.description);
    handleDelete(id);
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
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        placeholderText="Search foods, restaurants, etc..."
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center text-gray-900 mb-12">Share Your Supplies</h1>
        <div className="flex flex-col space-y-4 p-6 bg-gray-50 rounded-lg shadow-xl max-w-4xl mx-auto">
          <label className="font-bold text-3xl text-gray-700">Enter Heading</label>
          <input
            type="text"
            placeholder="Craft a captivating heading for your supplies"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="border border-gray-300 text-2xl shadow-sm rounded-lg p-4 w-full focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300"
          />
          <label className="font-bold text-3xl text-gray-700">Enter Description</label>
          <textarea
            placeholder="Provide an engaging description of your supplies"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 text-lg shadow-sm rounded-lg p-4 w-full h-60 focus:outline-none focus:ring-4 focus:ring-blue-400 resize-none transition-all duration-300"
          />
          <button
            onClick={handleShare}
            className="bg-orange-500 text-white text-3xl font-semibold rounded-lg py-4 shadow-md transform transition-all duration-300 hover:shadow-xl hover:bg-orange-600 active:scale-95 active:shadow-md"
          >
            Share
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {supplies.map((supply) => (
            <div key={supply.id} className="p-4 border rounded-lg shadow-md bg-white flex flex-col justify-between">
              <div onClick={() => handleShowDetails(supply)} className="w-full wcursor-pointer">
                <h2 className="text-xl font-bold">{supply.heading}</h2>
                <p className="text-gray-600">Created at: {supply.createdAt}</p>
                {supply.updatedAt && <p className="text-gray-500">Edited at: {supply.updatedAt}</p>}
              </div>
              <div>
                <button onClick={() => handleEdit(supply.id)} className="text-blue-500 hover:underline">Edit</button>
                <button onClick={() => handleDelete(supply.id)} className="text-red-500 hover:underline ml-4">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {isModalOpen && selectedSupply && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg p-6 max-w-md w-full relative"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-4">Supply Details</h2>
                <p className="mb-2"><strong>Heading:</strong> {selectedSupply.heading}</p>
                <p className="mb-2"><strong>Description:</strong> {selectedSupply.description}</p>
                <p className="mb-2"><strong>Created at:</strong> {selectedSupply.createdAt}</p>
                {selectedSupply.updatedAt && <p className="mb-2"><strong>Edited at:</strong> {selectedSupply.updatedAt}</p>}
                <button onClick={closeModal} className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2">
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ShareSupplies;