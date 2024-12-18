import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdReportProblem } from 'react-icons/md';
import { IoMdRefresh } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import AdminSearchBar from '../../Components/SearchBar/AdminSearchBar';
import { toast } from 'react-toastify';
import { getUserIssues, resolveUserIssues, ignoreUserIssues, refundUserIssues, getOrderDetails } from '../../Services/apiServices';
import { FaTimes } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import PropTypes from 'prop-types';

const UserIssues = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const { data } = await getUserIssues();
      if (data.success) {
        const formattedIssues = data.issues.map(issue => ({
          ...issue,
          userName: issue.username,
          email: issue.userEmail,
          problemType: issue.problemOn,
          refundAmount: issue.refund || 0
        }));
        setIssues(formattedIssues);
        toast.success('Issues refreshed successfully');
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast.error('Failed to fetch issues');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleResolve = async (id) => {
    setLoadingStates(prev => ({ ...prev, [`resolve_${id}`]: true }));
    try {
      const response = await resolveUserIssues(id);
      if (response.data.success) {
        setIssues(prevIssues => prevIssues.filter(issue => issue._id !== id));
        toast.success('Issue resolved successfully');
      }
    } catch (error) {
      console.error('Error resolving issue:', error);
      toast.error('Failed to resolve issue');
    } finally {
      setLoadingStates(prev => ({ ...prev, [`resolve_${id}`]: false }));
    }
  };

  const handleIgnore = async (id) => {
    setLoadingStates(prev => ({ ...prev, [`ignore_${id}`]: true }));
    try {
      const response = await ignoreUserIssues(id);
      if (response.data.success) {
        setIssues(prevIssues => prevIssues.filter(issue => issue._id !== id));
        toast.success('Issue ignored successfully');
      }
    } catch (error) {
      console.error('Error ignoring issue:', error);
      toast.error('Failed to ignore issue');
    } finally {
      setLoadingStates(prev => ({ ...prev, [`ignore_${id}`]: false }));
    }
  };

  const openRefundModal = (issue) => {
    setSelectedIssue(issue);
    setRefundAmount(issue.refundAmount.toString());
    setShowRefundModal(true);
  };

  const handleRefund = async () => {
    setLoadingStates(prev => ({ ...prev, refund: true }));
    try {
      const response = await refundUserIssues({
        userId: selectedIssue.userId,
        refundAmt: Number(refundAmount),
        issueId: selectedIssue._id
      });
      
      if (response.data.success) {
        toast.success('Refund processed successfully');
        setShowRefundModal(false);
        setSelectedIssue(null);
        setRefundAmount('');
        setIssues(prevIssues => prevIssues.filter(issue => issue._id !== selectedIssue._id));
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error('Failed to process refund');
    } finally {
      setLoadingStates(prev => ({ ...prev, refund: false }));
    }
  };

  const handleCopyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId)
      .then(() => toast.success('Order ID copied!'))
      .catch(() => toast.error('Failed to copy Order ID'));
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoadingOrder(true);
      const response = await getOrderDetails(orderId);
      if (response.data.success) {
        setOrderDetails(response.data.orderDetails);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to fetch order details');
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleViewOrderDetails = (issue) => {
    setSelectedIssue(issue);
    setShowOrderModal(true);
    fetchOrderDetails(issue.orderId);
  };

  const OrderDetailsModal = ({ issue, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {loadingOrder ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : orderDetails ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Order ID:</span>
              <span className="text-gray-800">{issue.orderId}</span>
              <button
                onClick={() => handleCopyOrderId(issue.orderId)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                title="Copy Order ID"
              >
                <MdContentCopy className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className="text-gray-600 font-medium">Restaurant:</span>
              <span className="ml-2 text-gray-800">{orderDetails.restaurantName}</span>
            </div>

            <div>
              <span className="text-gray-600 font-medium">Restaurant Address:</span>
              <span className="ml-2 text-gray-800">{orderDetails.restaurantAddress}</span>
            </div>

            <div>
              <span className="text-gray-600 font-medium">Order Date:</span>
              <span className="ml-2 text-gray-800">{orderDetails.orderDate}</span>
            </div>

            <div>
              <span className="text-gray-600 font-medium">Order Status:</span>
              <span className="ml-2 text-gray-800">{orderDetails.status}</span>
            </div>

            <div>
              <span className="text-gray-600 font-medium">Items:</span>
              <div className="mt-2 space-y-2">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-gray-800">{item.name} x{item.quantity}</span>
                    <span className="text-gray-600">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-gray-600 font-medium">Total Amount:</span>
              <span className="ml-2 text-gray-800">₹{orderDetails.totalAmount.toFixed(2)}</span>
            </div>

            <div>
              <span className="text-gray-600 font-medium">Delivery Address:</span>
              <p className="mt-1 text-gray-800">{orderDetails.deliveryAddress}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Failed to load order details
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  OrderDetailsModal.propTypes = {
    issue: PropTypes.shape({
      orderId: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  return (
    <div>
      <AdminSearchBar/>
      <div className="flex justify-between items-center px-6 mb-6">
        <h2 className="text-4xl font-bold text-gray-800">User Issues</h2>
        <div className="flex items-center gap-4">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded-lg outline-none"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <IoMdRefresh className={isLoading ? "animate-spin" : ""} size={20} />
            Refresh
          </motion.button>
        </div>
      </div>
      
      {issues.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-8 ms-6"
        >
          <MdReportProblem className="text-7xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Issues Reported</h3>
          <p className="text-gray-500 text-center">
            There are currently no pending issues from users. Check back later
          </p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ms-6">
            <AnimatePresence>
              {issues
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((issue) => (
                  <motion.div
                    key={issue._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-lg shadow-lg p-6 space-y-4"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{issue.userName}</h3>
                      <p className="text-gray-600 text-sm">{issue.email}</p>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600 font-medium">Problem On:</span>
                        <span className="ml-2 text-gray-800">{issue.problemType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Description:</span>
                        <p className="text-gray-800 mt-1">{issue.description}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Order ID:</span>
                        <span className="ml-2 text-gray-800">{issue.orderId}</span>
                      </div>
                      {issue.refundAmount > 0 && (
                        <div>
                          <span className="text-gray-600 font-medium">Requested Refund:</span>
                          <span className="ml-2 text-gray-800">₹{issue.refundAmount}</span>
                        </div>
                      )}
                    </div>

                    {issue.orderId && (
                          <>
                            <button
                              onClick={() => handleViewOrderDetails(issue)}
                              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              View Order Details
                            </button>
                          </>
                        )}

                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => handleResolve(issue._id)}
                        disabled={loadingStates[`resolve_${issue._id}`]}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loadingStates[`resolve_${issue._id}`] ? (
                          <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                          'Resolve'
                        )}
                      </button>
                      {issue.refundAmount > 0 && (
                        <button
                          onClick={() => openRefundModal(issue)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Refund
                        </button>
                      )}
                      <button
                        onClick={() => handleIgnore(issue._id)}
                        disabled={loadingStates[`ignore_${issue._id}`]}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loadingStates[`ignore_${issue._id}`] ? (
                          <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                          'Ignore'
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          {Math.ceil(issues.length / itemsPerPage) > 1 && (
            <div className="flex justify-center gap-2 mt-6 mb-6">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>
              {[...Array(Math.ceil(issues.length / itemsPerPage))].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === Math.ceil(issues.length / itemsPerPage)}
                className={`px-3 py-1 rounded ${
                  currentPage === Math.ceil(issues.length / itemsPerPage)
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Refund Modal */}

      <AnimatePresence>
        {showRefundModal && (
          <motion.div
            key="refund-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Refund Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">User Name</p>
                  <p className="font-medium">{selectedIssue?.userName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{selectedIssue?.email}</p>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Refund Amount (₹)</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowRefundModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRefund}
                    disabled={loadingStates.refund}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loadingStates.refund ? (
                      <AiOutlineLoading3Quarters className="animate-spin" />
                    ) : (
                      `Add to User's Zcoin`
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOrderModal && selectedIssue && (
          <OrderDetailsModal
            issue={selectedIssue}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedIssue(null);
              setOrderDetails(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserIssues;