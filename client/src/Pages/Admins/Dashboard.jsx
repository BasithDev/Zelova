import { LuUsers } from "react-icons/lu";
import { TfiPackage } from "react-icons/tfi";
import { GiProfit } from "react-icons/gi";
import {AiOutlineStock} from 'react-icons/ai'
import { FaFilePdf, FaFileExcel, FaStoreAlt } from "react-icons/fa";
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";
import { getReports, getRestaurants, exportReportToPDF, exportReportToExcel , blockUnblockRestaurant, getDashboardData} from "../../Services/apiServices";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {toast} from 'react-toastify';
import html2canvas from 'html2canvas';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [reports, setReports] = useState([]);
    const [reportType, setReportType] = useState('profit');
    const [timeRange, setTimeRange] = useState('month');
    const [chartType, setChartType] = useState('line');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [isExporting, setIsExporting] = useState(false);
    const chartRef = useRef(null);
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

    const fetchReports = useCallback(async () => {
        try {
            const response = await getReports(
                reportType,
                timeRange,
                dateRange.startDate,
                dateRange.endDate
            );
            setReports(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [reportType, timeRange, dateRange.startDate, dateRange.endDate]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

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

    const handleDateRangeChange = (type) => {
        const today = new Date();
        const endDate = today.toISOString().split('T')[0];
        let startDate = '';

        if (type === 'custom') {
            setTimeRange('custom');
            return;
        }

        switch (type) {
            case 'week': {
                const lastWeek = new Date(today.setDate(today.getDate() - 7));
                startDate = lastWeek.toISOString().split('T')[0];
                break;
            }
            case 'month': {
                const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
                startDate = lastMonth.toISOString().split('T')[0];
                break;
            }
            case 'year': {
                const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));
                startDate = lastYear.toISOString().split('T')[0];
                break;
            }
            default:
                startDate = endDate; // for 'today'
        }

        setTimeRange(type);
        setDateRange({ startDate, endDate });
    };

    const getChartDataKey = () => {
        switch (reportType) {
            case 'order':
            case 'user':
                return 'count';
            case 'sales':
                return 'sales';
            case 'profit':
                return 'profit';
            default:
                return 'count';
        }
    };

    const getChartLabel = () => {
        switch (reportType) {
            case 'order':
                return 'Orders';
            case 'user':
                return 'Users';
            case 'sales':
                return 'Sales (₹)';
            case 'profit':
                return 'Profit (₹)';
            default:
                return '';
        }
    };

    const handleExport = async (type) => {
        try {
            setIsExporting(true);
            
            const chartElement = chartRef.current;
            const canvas = await html2canvas(chartElement);
            const chartImage = canvas.toDataURL('image/png');
            
            const exportData = {
                reportData: reports,
                chartImage,
                reportType,
                timeRange,
                dateRange
            };
            const response = type === 'pdf' 
                ? await exportReportToPDF(exportData)
                : await exportReportToExcel(exportData);
            
            const blob = new Blob([response.data], { 
                type: type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const timestamp = Date.now();
            const link = document.createElement('a');
            link.href = url;
            link.download = `zelova_${reportType}_report_${new Date().toISOString().split('T')[0]}_${timestamp}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error(`Error exporting ${type.toUpperCase()}:`, error);
            toast.error(`Failed to export ${type.toUpperCase()}`);
        } finally {
            setIsExporting(false);
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

            <motion.div 
                variants={childVariants}
                className="bg-white p-6 rounded-xl mx-6 shadow-lg mb-8"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                    <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={chartType === 'bar'}
                                    onChange={() => setChartType(prev => prev === 'line' ? 'bar' : 'line')}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-2 text-sm font-medium text-gray-900">
                                    {chartType === 'line' ? 'Line' : 'Bar'} Chart
                                </span>
                            </label>
                        </div>
                        <select
                            className="bg-gray-50 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <option value="profit">Profit</option>
                            <option value="sales">Sales</option>
                            <option value="order">Orders</option>
                            <option value="user">Users</option>
                        </select>
                        <select 
                            className="bg-gray-50 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={timeRange}
                            onChange={(e) => handleDateRangeChange(e.target.value)}
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                        
                        {timeRange === 'custom' && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="bg-gray-50 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span>to</span>
                                <input
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="bg-gray-50 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-4 mb-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleExport('pdf')}
                        disabled={isExporting}
                        className={`flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg ${
                            isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                        }`}
                    >
                        <FaFilePdf />
                        {isExporting ? 'Exporting...' : 'Export PDF'}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleExport('excel')}
                        disabled={isExporting}
                        className={`flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg ${
                            isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                        }`}
                    >
                        <FaFileExcel />
                        {isExporting ? 'Exporting...' : 'Export Excel'}
                    </motion.button>
                </div>
                <div ref={chartRef} className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'line' ? (
                            <LineChart
                                data={reports}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(value) => reportType === 'profit' || reportType === 'sales' ? value.toFixed(2) : value} />
                                <Tooltip 
                                    formatter={(value) => {
                                        if (reportType === 'profit' || reportType === 'sales') {
                                            return ['₹' + Number(value).toFixed(2), getChartLabel()];
                                        }
                                        return [value, getChartLabel()];
                                    }}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey={getChartDataKey()}
                                    name={getChartLabel()}
                                    stroke="#8884d8" 
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        ) : (
                            <BarChart
                                data={reports}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(value) => reportType === 'profit' || reportType === 'sales' ? value.toFixed(2) : value} />
                                <Tooltip 
                                    formatter={(value) => {
                                        if (reportType === 'profit' || reportType === 'sales') {
                                            return ['₹' + Number(value).toFixed(2), getChartLabel()];
                                        }
                                        return [value, getChartLabel()];
                                    }}
                                />
                                <Legend />
                                <Bar 
                                    dataKey={getChartDataKey()}
                                    name={getChartLabel()}
                                    fill="#8884d8" 
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </motion.div>

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