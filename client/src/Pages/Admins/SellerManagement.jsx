import { LuUsers } from "react-icons/lu";
import { TfiPackage } from "react-icons/tfi";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";
import React,{ useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";

const fetchVendors = async () => {
  const { data } = await axios.get("http://localhost:3000/api/admin/manage/vendors");
  return data;
};

const VendorManagement = () => {
  const { data: vendors, isLoading, isError } = useQuery({
    queryKey: ['vendors'],
    queryFn: fetchVendors,
    staleTime: 60000,
    cacheTime: 300000,
  });

  const [openVendor, setOpenVendor] = useState(null);

  const toggleVendorDetails = (vendorId) => {
    setOpenVendor(openVendor === vendorId ? null : vendorId);
  };

  return (
    <div className="py-6 space-x-6">
      <AdminSearchBar />

      <h1 className="text-3xl font-bold mb-6">Vendor Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="flex items-center p-6 bg-gray-50 rounded-lg shadow-md hover:bg-white hover:shadow-lg transform transition duration-300">
          <LuUsers className="text-4xl text-purple-500 mr-4" />
          <div>
            <p className="text-gray-500">Total Vendors</p>
            <p className="text-2xl font-bold">{vendors ? vendors.length : 0}</p>
          </div>
        </div>
        <div className="flex items-center p-6 bg-gray-50 rounded-lg shadow-md hover:bg-white hover:shadow-lg transform transition duration-300">
          <TfiPackage className="text-4xl text-yellow-500 mr-4" />
          <div>
            <p className="text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Vendors</h2>

        {isLoading ? (
          <p>Loading vendors...</p>
        ) : isError ? (
          <p>Error loading vendors. Please try again later.</p>
        ) : vendors && vendors.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="py-3 px-4">Vendor Name</th>
                <th className="py-3 px-4">Mail ID</th>
                <th className="py-3 px-4">Z Coins</th>
                <th className="py-3 px-4">Block/Unblock</th>
                <th className="py-3 px-4">Vendor Profile</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <React.Fragment key={vendor._id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{vendor.fullname}</td>
                    <td className="py-3 px-4">{vendor.email}</td>
                    <td className="py-3 px-4">{vendor.zCoins}</td>
                    <td className="py-3 px-4">
                      <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition">
                        Block
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                        onClick={() => toggleVendorDetails(vendor._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                  <AnimatePresence>
                  {openVendor === vendor._id && (
                    <tr className="border-b bg-gray-100">
                      <td colSpan="5" className="py-3 px-4">
                      <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                        <div className="p-4 rounded-lg bg-white shadow-md">
                            <div className="flex items-center mb-4">
                              {vendor.profilePicture ? (
                                <img
                                  src={vendor.profilePicture}
                                  alt="Profile"
                                  className="w-16 h-16 rounded-full mr-4"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                                  <span className="text-gray-500">N/A</span>
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-lg">{vendor.fullname}</p>
                                <p className="text-gray-500">{vendor.email}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <p><strong>Age:</strong> {vendor.age || "N/A"}</p>
                              <p><strong>Phone:</strong> {vendor.phoneNumber || "N/A"}</p>
                              <p><strong>Status:</strong> {vendor.status || "N/A"}</p>
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
        ) : (
          <p>No vendors available.</p>
        )}
      </div>
    </div>
  );
};

export default VendorManagement;