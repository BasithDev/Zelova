import { LuUsers } from "react-icons/lu";
import { TfiPackage } from "react-icons/tfi";
import { AiOutlineStock } from "react-icons/ai";
import { GiProfit } from "react-icons/gi";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";
import { getReports, exportReportToPDF, exportReportToExcel } from "../../Services/apiServices";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {toast} from 'react-toastify';
import html2canvas from 'html2canvas';

const Dashboard = () => {
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
            
            // Capture chart as image
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
            
            // Export based on type
            const response = type === 'pdf' 
                ? await exportReportToPDF(exportData)
                : await exportReportToExcel(exportData);
            
            // Handle the blob response
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
                className="grid px-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
                            <p className="text-2xl font-bold">40,689</p>
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
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <TfiPackage className="text-3xl text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Orders</p>
                            <p className="text-2xl font-bold">10,293</p>
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
                            <p className="text-2xl font-bold">₹89,000</p>
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
                            <p className="text-2xl font-bold">₹2,040</p>
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
                    <h2 className="text-2xl font-bold">Recent Orders</h2>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        View All
                    </motion.button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left">Restaurant</th>
                                <th className="py-3 px-4 text-left">Owner Name</th>
                                <th className="py-3 px-4 text-left">Categories</th>
                                <th className="py-3 px-4 text-left">Amount</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <motion.tr 
                                variants={childVariants}
                                className="border-t hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center space-x-3">
                                        <img src="https://placehold.co/50x50" alt="Restaurant" className="w-10 h-10 rounded-full object-cover" />
                                        <span className="font-medium">Hotel New Empire</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">Kenneth</td>
                                <td className="py-4 px-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Biryani</span>
                                </td>
                                <td className="py-4 px-4 font-medium">₹295</td>
                                <td className="py-4 px-4">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-colors"
                                    >
                                        Block
                                    </motion.button>
                                </td>
                                <td className="py-4 px-4">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                    >
                                        View Details
                                    </motion.button>
                                </td>
                            </motion.tr>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;