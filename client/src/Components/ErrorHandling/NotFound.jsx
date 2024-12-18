import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const NotFound = ({ isAdmin = false }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-lg w-full text-center"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <h1 className={`text-6xl md:text-8xl font-bold ${isAdmin ? 'text-blue-500' : 'text-orange-500'} mb-4`}>404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            {isAdmin 
              ? "Sorry, we couldn't find the admin page you're looking for."
              : "Sorry, we couldn't find the page you're looking for."
            }
          </p>
          <button
            onClick={handleGoBack}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
              isAdmin 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isAdmin ? 'Back to Admin Dashboard' : 'Back to Home'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

NotFound.propTypes = {
  isAdmin: PropTypes.bool
};

export default NotFound;
