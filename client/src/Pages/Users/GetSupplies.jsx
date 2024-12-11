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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Supplies Near You</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {supplies.map((supply) => (
                <motion.div
                  key={supply._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl relative"
                >
                  <span className="absolute top-2 right-2 bg-orange-100 text-orange-600 font-bold text-sm rounded-full px-3 py-1">
                    {supply.distance.toFixed(1)} km
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{supply.heading}</h2>
                  <p className="text-gray-600 mb-4">{supply.description}</p>
                  <div className="flex items-center text-gray-600">
                    <span>ContactNumber : {supply.contactNumber}</span>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Posted: {new Date(supply.createdAt).toLocaleString()}</p>
                  </div>
                  <button 
                    className='bg-gray-200 text-gray-500 rounded-full p-3 mt-3 hover:bg-orange-300 hover:text-orange-500 transition-all duration-300'
                    onClick={() => window.location.href = `tel:${supply.contactNumber}`}
                  >
                    <FaPhoneAlt/>
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