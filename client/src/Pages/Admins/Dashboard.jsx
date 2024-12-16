import { LuUsers } from "react-icons/lu";
import { TfiPackage } from "react-icons/tfi";
import { GiProfit } from "react-icons/gi";
import { FaStoreAlt } from 'react-icons/fa';
import {AiOutlineStock} from 'react-icons/ai'
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";
import AnalyticsDashboard from '../../Components/AnalyticsDashboard';
import { getReports, getRestaurants, exportReportToPDF, exportReportToExcel , blockUnblockRestaurant, getDashboardData} from "../../Services/apiServices";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";


const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 5;

    const fetchResturants = useCallback(async () => {
        try {
            const response = await getRestaurants();
            setRestaurants(response.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            const response = await getDashboardData();
            setDashboardData(response.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(()=>{
        fetchResturants();
        fetchDashboardData();
    },[fetchResturants,fetchDashboardData])
;

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0
        }
    };



    const handleBlockUnblock = async (id) => {
        try {
            await blockUnblockRestaurant(id);
            setRestaurants(prevRestaurants =>
                prevRestaurants.map(restaurant =>
                    restaurant._id === id
                        ? { ...restaurant, isActive: !restaurant.isActive }
                        : restaurant
                )
            );
        } catch (error) {
            console.error('Error toggling restaurant status:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.vendorId.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentRestaurants = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants} 
            className="min-h-screen bg-gray-50 pb-8"
        >
            <AdminSearchBar/>
            <motion.h1 
                variants={childVariants}
                className="text-3xl px-6 font-bold mb-8 pt-6"
            >
                Dashboard Overview
            </motion.h1>

            <motion.div 
                variants={childVariants}
                className="grid px-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
            >
                <motion.div 
                    variants={childVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <LuUsers className="text-3xl text-purple-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Users</p>
                            <p className="text-2xl font-bold">{dashboardData?.totalUsers}</p>
                            <p className="text-gray-500 text-sm">Active Accounts</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    variants={childVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <FaStoreAlt className="text-3xl text-orange-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Restaurants</p>
                            <p className="text-2xl font-bold">{dashboardData?.totalRestaurants}</p>
                            <p className="text-gray-500 text-sm">Active Restaurants</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    variants={childVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <TfiPackage className="text-3xl text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Orders</p>
                            <p className="text-2xl font-bold">{dashboardData?.totalOrders}</p>
                            <p className="text-gray-500 text-sm">Completed Orders</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    variants={childVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <AiOutlineStock className="text-3xl text-green-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Sales</p>
                            <p className="text-2xl font-bold">₹{dashboardData?.totalSales}</p>
                            <p className="text-gray-500 text-sm">Revenue Generated</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    variants={childVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <GiProfit className="text-3xl text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Profit</p>
                            <p className="text-2xl font-bold">₹{dashboardData?.totalProfit}</p>
                            <p className="text-gray-500 text-sm">Net Earnings</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <AnalyticsDashboard 
                fetchReports={getReports} 
                exportReportToPDF={exportReportToPDF} 
                exportReportToExcel={exportReportToExcel} 
            />

            <motion.div 
                variants={childVariants}
                className="bg-white p-6 mx-6 rounded-xl shadow-lg"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Available Restaurants</h2>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left">Restaurant</th>
                                <th className="py-3 px-4 text-left">Owner Details</th>
                                <th className="py-3 px-4 text-left">Contact</th>
                                <th className="py-3 px-4 text-left">Timings</th>
                                <th className="py-3 px-4 text-left">Rating</th>
                                <th className="py-3 px-4 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRestaurants.length > 0 ? (
                                currentRestaurants.map((restaurant) => (
                                    <motion.tr 
                                        key={restaurant._id}
                                        variants={childVariants}
                                        className="border-t hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <img 
                                                    src={restaurant.image} 
                                                    alt={restaurant.name} 
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <span className="font-medium block">{restaurant.name}</span>
                                                    <span className="text-sm text-gray-500">{restaurant.address}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <span className="font-medium block">{restaurant.vendorId.fullname}</span>
                                                <span className="text-sm text-gray-500">{restaurant.vendorId.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <span className="block">Restaurant: {restaurant.phone}</span>
                                                <span className="text-sm text-gray-500">Owner : {restaurant.vendorId.phoneNumber}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm">
                                                {restaurant.openingTime} - {restaurant.closingTime}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center">
                                                <span className="text-yellow-500 mr-1">★</span>
                                                <span>{restaurant.avgRating.toFixed(1)}</span>
                                                <span className="text-sm text-gray-500 ml-1">
                                                    ({restaurant.totalRatingCount})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`${
                                                    restaurant.isActive 
                                                        ? 'bg-green-500 hover:bg-green-600' 
                                                        : 'bg-red-500 hover:bg-red-600'
                                                } text-white px-4 py-1.5 rounded-lg text-sm transition-colors`}
                                                onClick={() => handleBlockUnblock(restaurant._id)}
                                            >
                                                {restaurant.isActive ? 'Active' : 'Inactive'}
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        No restaurants found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-3 py-1 mx-1 rounded ${
                                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;