import { FaBell, FaSearch } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { TfiPackage } from "react-icons/tfi";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchvendors = async () => {
    const { data } = await axios.get("http://localhost:3000/api/admin/manage/get-vendors");
    return data;
  };


const vendorManagement = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data:vendors, isLoading, isError } = useQuery({
        queryKey: [''],
        queryFn: fetchvendors,
        staleTime: 60000, // Data is considered fresh for 1 minute
        cacheTime: 300000, // Data stays in cache for 5 minutes
      });
  return (
    <div className="py-6 px-4 lg:px-8">

      <div className="flex justify-between items-center border-b-2 pb-4 mb-8">
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>

        <div className="flex items-center space-x-6">
          <FaBell className="text-yellow-500 text-2xl" />
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div>
              <p className="font-semibold">Max</p>
              <p className="text-sm text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-6">Vendor Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="flex items-center p-6 bg-gray-50 rounded-lg shadow-md hover:bg-white hover:shadow-lg transform transition duration-300">
          <LuUsers className="text-4xl text-purple-500 mr-4" />
          <div>
            <p className="text-gray-500">Total vendors</p>
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
        <h2 className="text-2xl font-semibold mb-4">vendors</h2>

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
              {vendors.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.fullname}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.zCoins}</td>
                  <td className="py-3 px-4">
                    <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition">
                      Block
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No vendors available.</p>
        )}
      </div>
    </div>
  )
}

export default vendorManagement