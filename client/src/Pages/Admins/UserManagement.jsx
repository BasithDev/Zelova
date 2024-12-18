import { LuUsers } from "react-icons/lu";
import { TfiPackage } from "react-icons/tfi";
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { blockUnblockUser, fetchUsers } from "../../Services/apiServices";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsersDetails = async () => {
      try {
        const { data } = await fetchUsers();
        setUsers(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsError(true);
        setIsLoading(false);
      }
    };
    fetchUsersDetails();
  }, []);

  const handleBlockUnblock = async (userId, currentStatus) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";
    try {
      const res = await blockUnblockUser(userId, { status: newStatus });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const [expandedUserId, setExpandedUserId] = useState(null);

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />
      <AdminSearchBar />
      <motion.h1
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl px-3 text-center font-bold mb-8">User Management</motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          opacity: { duration: 0.5 },
          y: { type: 'spring', stiffness: 100, damping: 20 },
        }}
        className="grid px-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="flex items-center p-6 bg-gray-50 rounded-lg shadow-md hover:bg-white hover:shadow-lg transform transition duration-300">
          <LuUsers className="text-4xl text-purple-500 mr-4" />
          <div>
            <p className="text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{users ? users.length : 0}</p>
          </div>
        </div>
        <div className="flex items-center p-6 bg-gray-50 rounded-lg shadow-md hover:bg-white hover:shadow-lg transform transition duration-300">
          <TfiPackage className="text-4xl text-yellow-500 mr-4" />
          <div>
            <p className="text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          opacity: { duration: 0.5 },
          y: { type: 'spring', stiffness: 100, damping: 20 },
        }}
        className="bg-white p-6 mx-3 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>

        {isLoading ? (
          <p>Loading users...</p>
        ) : isError ? (
          <p>Error loading users. Please try again later.</p>
        ) : users && users.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <select
                className="border rounded p-1"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Mail ID</th>
                  <th className="py-3 px-4">Z Coins</th>
                  <th className="py-3 px-4">Block/Unblock</th>
                  <th className="py-3 px-4">User Profile</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <React.Fragment key={user._id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.fullname}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.zCoins}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleBlockUnblock(user._id, user.status)}
                          className={`${
                            user.status === "blocked"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          } text-white px-3 py-1 rounded-md transition`}
                        >
                          {user.status === "blocked" ? "Unblock" : "Block"}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleExpand(user._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedUserId === user._id && (
                        <tr>
                          <td colSpan="5" className="p-4 bg-gray-100">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 rounded-lg bg-white shadow-md">
                                <div className="flex items-center mb-4">
                                  {user.profilePicture ? (
                                    <img
                                      src={user.profilePicture}
                                      alt="Profile"
                                      className="w-16 h-16 rounded-full mr-4"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                                      <span className="text-gray-500">N/A</span>
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-bold text-lg">{user.fullname}</p>
                                    <p className="text-gray-500">{user.email}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <p><strong>Age:</strong> {user.age || "N/A"}</p>
                                  <p><strong>Phone:</strong> {user.phoneNumber || "N/A"}</p>
                                  <p><strong>Status:</strong> {user.status || "N/A"}</p>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
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
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No users available.</p>
        )}
      </motion.div>
    </div>
  );
};

export default UserManagement;