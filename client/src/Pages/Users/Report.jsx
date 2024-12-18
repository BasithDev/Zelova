import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { raiseIssue } from '../../Services/apiServices';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const userData = useSelector((state) => state.userData.data);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!issueType) {
        toast.error('Please select a problem type');
        return;
      }
      if (!issueDescription.trim()) {
        toast.error('Please describe your issue');
        return;
      }
      if (showOrderIdField && !orderId.trim()) {
        toast.error('Please enter the Order ID');
        return;
      }

      setIsSubmitting(true);

      const issueData = {
        userId: userData._id,
        username: userData.fullname,
        userEmail: userData.email,
        problemOn: issueType,
        description: issueDescription,
        refund: refundAmount ? Number(refundAmount) : 0,
        orderId: orderId || undefined
      };

      const response = await raiseIssue(issueData);
      
      if (response.data.success) {
        setIssueType('');
        setIssueDescription('');
        setRefundAmount('');
        setOrderId('');
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/profile');
  };

  const showRefundField = ['food', 'delivery', 'restaurant'].includes(issueType);
  const showOrderIdField = ['food', 'delivery', 'restaurant'].includes(issueType);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 md:p-8 rounded-xl shadow-2xl space-y-4 md:space-y-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8">Report an Issue</h1>
          
          <div>
            <label className="block text-base md:text-lg font-semibold text-gray-800">Problem Type</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="mt-2 border-2 w-full p-2.5 md:p-3 text-base md:text-lg border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              <option value="">Select an option</option>
              <option value="delivery">Delivery</option>
              <option value="food">Food</option>
              <option value="restaurant">Restaurant</option>
              <option value="application">Application</option>
              <option value="others">Others</option>
            </select>
          </div>

          {showOrderIdField && (
            <div>
              <label className="block text-base md:text-lg font-semibold text-gray-800">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="mt-2 border-2 w-full p-2.5 md:p-3 text-base md:text-lg border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your Order ID"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-sm text-gray-500">
                You can find the Order ID in your orders history
              </p>
            </div>
          )}

          <div>
            <label className="block text-base md:text-lg font-semibold text-gray-800">Issue Description</label>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              rows="4"
              className="mt-2 block w-full p-2.5 md:p-3 text-base md:text-lg border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your issue here..."
              disabled={isSubmitting}
            />
          </div>

          {showRefundField && (
            <div>
              <label className="block text-base md:text-lg font-semibold text-gray-800">Request Refund Amount</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="mt-2 block w-full p-2.5 md:p-3 text-base md:text-lg border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter amount (optional)"
                min="0"
                disabled={isSubmitting}
              />
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2.5 md:py-3 px-4 md:px-6 border border-transparent rounded-lg shadow-lg text-base md:text-lg font-medium text-white ${
              isSubmitting 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </motion.button>
        </motion.div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.5, y: 100, opacity: 0 }}
            animate={{ 
              scale: 1, 
              y: 0, 
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
              }
            }}
            exit={{ scale: 0.5, y: 100, opacity: 0 }}
            className="bg-white p-4 md:p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4"
            >
              Issue Reported Successfully!
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base text-gray-600 mb-4 md:mb-6"
            >
              {`A response will be sent to your email address. We'll get back to you as soon as possible.`}
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleModalClose}
              className="w-full bg-indigo-600 text-white py-2 md:py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-base md:text-lg"
            >
              Okay
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Report;