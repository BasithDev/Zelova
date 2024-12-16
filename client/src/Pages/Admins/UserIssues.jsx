import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdReportProblem } from 'react-icons/md';
import { IoMdRefresh } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import AdminSearchBar from '../../Components/SearchBar/AdminSearchBar';
import { toast } from 'react-toastify';
import { getUserIssues, resolveUserIssues, ignoreUserIssues, refundUserIssues } from '../../Services/apiServices';

const UserIssues = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
                      {issue.refundAmount > 0 && (
                        <div>
                          <span className="text-gray-600 font-medium">Requested Refund:</span>
                          <span className="ml-2 text-gray-800">₹{issue.refundAmount}</span>
                        </div>
                      )}
                    </div>

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
    </div>
  );
};

export default UserIssues;