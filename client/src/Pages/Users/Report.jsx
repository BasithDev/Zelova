import { useState } from 'react';
import { motion } from 'framer-motion';

const Report = () => {
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');

  const handleSubmit = () => {
    // Handle the report submission logic here
    console.log('Report submitted:', { issueType, issueDescription });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 w-full max-w-2xl bg-white rounded-3xl shadow-2xl space-y-8">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700">Report a Problem</h2>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-lg font-semibold text-gray-800">Problem with</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="mt-2 border-2 w-full p-3 text-lg border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select an option</option>
              <option value="delivery">Delivery</option>
              <option value="food">Food</option>
              <option value="restaurant">Restaurant</option>
              <option value="application">Application</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-800">Issue Description</label>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              rows="5"
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your issue here..."
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Report
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Report;