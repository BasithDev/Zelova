import { useEffect, useState } from 'react';
import Header from '../../Components/Common/Header';
import { getSupplies } from '../../Services/apiServices';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhoneAlt } from 'react-icons/fa';

const GetSupplies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const userLocation = useSelector(state => state?.userLocation?.coordinates);
  const [lat, lon] = userLocation ? Object.values(userLocation) : [0, 0];
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableSupplies = async () => {
      try {
        const response = await getSupplies(lat, lon);
        setSupplies(response.data.supplies);
      } catch (error) {
        console.error('Error fetching supplies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableSupplies();
  }, [lat, lon, userLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        placeholderText="Search foods, restaurants, etc..."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
            Get Supplies
          </h1>
          <p className="mt-4 text-xl text-gray-600">Receive Support and Essential Supplies with Ease</p>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Available Supplies Near You</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 sm:h-32 sm:w-32"></div>
          </div>
        ) : supplies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <img 
              src="/no-data.svg" 
              alt="No supplies" 
              className="w-40 h-40 mb-4 opacity-60"
            />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Supplies Available</h2>
            <p className="text-gray-500">There are currently no supplies shared in your area.</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6">
              {supplies.map((supply) => (
                <motion.div
                  key={supply._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-xl shadow-md p-4 sm:p-6 transform transition-all duration-300 hover:shadow-xl relative"
                >
                  <span className="absolute top-3 right-3 bg-orange-100 text-orange-600 font-semibold text-sm rounded-full px-3 py-1">
                    {supply.distance.toFixed(1)} km
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 pr-20">{supply.heading}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{supply.description}</p>
                  <div className="flex items-center text-gray-600 text-sm sm:text-base">
                    <span className="flex items-center gap-1">
                      Contact : 
                      {supply.contactNumber}
                    </span>
                  </div>
                  <div className="mt-3 text-xs sm:text-sm text-gray-500">
                    <p>Posted: {new Date(supply.createdAt).toLocaleString()}</p>
                  </div>
                  <button 
                    className="absolute bottom-3 right-3 bg-gray-100 text-gray-500 rounded-full p-2.5 sm:p-3 hover:bg-orange-100 hover:text-orange-500 transition-all duration-300 shadow-sm"
                    onClick={() => window.location.href = `tel:${supply.contactNumber}`}
                    aria-label="Call supplier"
                  >
                    <FaPhoneAlt size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default GetSupplies;