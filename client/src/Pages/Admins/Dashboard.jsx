import { FaSearch } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { TfiPackage } from "react-icons/tfi";
import { AiOutlineStock } from "react-icons/ai";
import { GiProfit } from "react-icons/gi";
import { FaBell } from "react-icons/fa";
const Dashboard = () => {
    return (
        <div className="py-3">

            <div className="flex justify-between border-b-2 p-3 items-center mb-6 ">
                <div className="relative w-1/2">
                    <input type="text" placeholder="Search" className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                </div>
                <div className="flex items-center space-x-4">
                    <FaBell className="text-yellow-500 text-2xl" />
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div>
                            <p className="font-semibold">Max</p>
                            <p className="text-sm text-gray-500">Admin</p>
                        </div>
                    </div>
                </div>
            </div>

            <h1 className="text-2xl px-3 font-bold mb-6">Dashboard</h1>

            <div className="grid px-3 grid-cols-4 gap-6 mb-6">

                <div className="bg-gray-50 hover:bg-white hover:scale-105 hover:shadow-xl transition-all duration-300 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-4">
                        <LuUsers className="text-4xl text-purple-500" />
                        <div>
                            <p className="text-gray-500">Total Users</p>
                            <p className="text-2xl font-bold">40,689</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 hover:bg-white hover:scale-105 hover:shadow-xl transition-all duration-300 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-4">
                        <TfiPackage className="text-4xl text-yellow-500" />
                        <div>
                            <p className="text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold">10293</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 hover:bg-white hover:scale-105 hover:shadow-xl transition-all duration-300 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-4">
                        <AiOutlineStock className="text-4xl text-green-500" />
                        <div>
                            <p className="text-gray-500">Total Sales</p>
                            <p className="text-2xl font-bold">₹89,000</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 hover:bg-white hover:scale-105 hover:shadow-xl transition-all duration-300 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-4">
                        <GiProfit className="text-4xl text-green-500" />
                        <div>
                            <p className="text-gray-500">Total Profit</p>
                            <p className="text-2xl font-bold">₹2040</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg mx-3 shadow-[0_0px_24px_rgba(0,0,0,0.2)] mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Sales Details</h2>
                    <div className="flex items-center space-x-4">
                        <select className="border border-gray-300 rounded-lg p-2">
                            <option>October</option>
                        </select>
                        <select className="border border-gray-300 rounded-lg p-2">
                            <option>Users</option>
                        </select>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Get Statement</button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Show</button>
                    </div>
                </div>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">[Graph Placeholder]</p>
                </div>
            </div>

            <div className="bg-white p-6 mx-3 rounded-lg shadow-[0_0px_24px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Items</h2>
                    <select className="border border-gray-300 rounded-lg p-2">
                        <option>Select</option>
                    </select>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="py-2">Product Name</th>
                            <th className="py-2">Restaurant</th>
                            <th className="py-2">Owner Name</th>
                            <th className="py-2">Categories</th>
                            <th className="py-2">Amount</th>
                            <th className="py-2">Block/Unblock</th>
                            <th className="py-2">Product</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t hover:bg-gray-100">
                            <td className="py-2 flex items-center space-x-2">
                                <img src="https://placehold.co/50x50" alt="Chicken Biryani" className="w-10 h-10 rounded-full" />
                                <span>Chicken Biryani</span>
                            </td>
                            <td className="py-2">Hotel New Empire</td>
                            <td className="py-2">Kenneth</td>
                            <td className="py-2">Biryani</td>
                            <td className="py-2">295</td>
                            <td className="py-2">
                                <button className="bg-red-500 hover:bg-red-600 transition-all text-white px-4 py-2 rounded-lg">Block</button>
                            </td>
                            <td className="py-2">
                                <button className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-4 py-2 rounded-lg">View</button>
                            </td>
                        </tr>
                        <tr className="border-t hover:bg-gray-100">
                            <td className="py-2 flex items-center space-x-2">
                                <img src="https://placehold.co/50x50" alt="Chicken Shawarma" className="w-10 h-10 rounded-full" />
                                <span>Chicken Shawarma</span>
                            </td>
                            <td className="py-2">Hotel Taj</td>
                            <td className="py-2">Marco</td>
                            <td className="py-2">Shawarma</td>
                            <td className="py-2">395</td>
                            <td className="py-2">
                                <button className="bg-green-500 hover:bg-green-600 transition-all text-white px-4 py-2 rounded-lg">Unblock</button>
                            </td>
                            <td className="py-2">
                                <button className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-4 py-2 rounded-lg">View</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Dashboard