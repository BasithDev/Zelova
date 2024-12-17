import { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import PropTypes from 'prop-types';

const AnalyticsDashboard = ({ fetchReports, exportReportToPDF, exportReportToExcel, initialReportType = 'profit' }) => {
    const [reports, setReports] = useState([]);
    const [reportType, setReportType] = useState(initialReportType);
    const [timeRange, setTimeRange] = useState('month');
    const today = new Date();
    const defaultStartDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
    const defaultEndDate = new Date().toISOString().split('T')[0];
    const [dateRange, setDateRange] = useState({ startDate: defaultStartDate, endDate: defaultEndDate });
    const [isExporting, setIsExporting] = useState(false);
    const [chartType, setChartType] = useState('line');
    const chartRef = useRef(null);

    const fetchReportData = useCallback(async () => {
        try {
            const response = await fetchReports(reportType, timeRange, dateRange.startDate, dateRange.endDate);
            setReports(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [fetchReports, reportType, timeRange, dateRange.startDate, dateRange.endDate]);

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

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
            link.download = `Report_${reportType}_${new Date().toISOString().split('T')[0]}_${timestamp}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
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
            case 'sales':
                return 'Sales (₹)';
            case 'profit':
                return 'Profit (₹)';
            default:
                return '';
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl mx-4 sm:mx-6 shadow-lg mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold">Analytics Dashboard</h2>
                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2 sm:gap-4">
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
                    </div>
                    {timeRange === 'custom' && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                className="w-full sm:w-auto bg-gray-50 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="hidden sm:block">to</span>
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                className="w-full sm:w-auto bg-gray-50 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end gap-2 sm:gap-4 mb-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleExport('pdf')}
                    disabled={isExporting}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg ${
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
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg ${
                        isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                    }`}
                >
                    <FaFileExcel />
                    {isExporting ? 'Exporting...' : 'Export Excel'}
                </motion.button>
            </div>
            <div ref={chartRef} className="h-[300px] sm:h-[400px] w-full">
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
        </div>
    );
};
AnalyticsDashboard.propTypes = {
    reports: PropTypes.array.isRequired,
    fetchReports: PropTypes.func.isRequired,
    exportReportToPDF: PropTypes.func.isRequired,
    exportReportToExcel: PropTypes.func.isRequired,
    initialReportType: PropTypes.string,
};
export default AnalyticsDashboard;