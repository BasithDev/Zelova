import { LuUsers } from "react-icons/lu";
import { TfiPackage } from "react-icons/tfi";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";

const fetchUsers = async () => {
    const { data } = await axios.get("http://localhost:3000/api/admin/manage/users");
    return data;
  };

const UserManagement =  () => {
    const { data:users, isLoading, isError } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        staleTime: 60000, // Data is considered fresh for 1 minute
        cacheTime: 300000, // Data stays in cache for 5 minutes
      });

  return (
    <div className="py-6 px-4 lg:px-8">

      <AdminSearchBar/>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>

        {isLoading ? (
          <p>Loading users...</p>
        ) : isError ? (
          <p>Error loading users. Please try again later.</p>
        ) : users && users.length > 0 ? (
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
              {users.map((user) => (
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
          <p>No users available.</p>
        )}
      </div>
    </div>
  );
};

export default UserManagement;