import { motion } from 'framer-motion';
import { FcShop, FcBusinessman } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const RoleManagement = () => {
  const navigate = useNavigate()
  return (
    <motion.div 
      className="flex items-center justify-center min-h-screen bg-gray-100 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl max-w-md w-full text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Choose Your Role</h2>
        <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Do you want to continue as a Vendor or User?</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-around space-y-4 sm:space-y-0 sm:space-x-6">
          <button 
            onClick={() => navigate('/vendor')} 
            className="w-full sm:w-auto flex flex-col items-center bg-gradient-to-r from-green-400 to-green-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-md hover:from-green-500 hover:to-green-600 transition-all duration-200"
          >
            <FcShop className="text-3xl sm:text-4xl mb-1" />
            <span className="text-sm sm:text-base font-medium">Vendor</span>
          </button>

          <button 
            onClick={() => navigate('/')} 
            className="w-full sm:w-auto flex flex-col items-center bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition-all duration-200"
          >
            <FcBusinessman className="text-3xl sm:text-4xl mb-1" />
            <span className="text-sm sm:text-base font-medium">User</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoleManagement;