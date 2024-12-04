import { FaShoppingBag, FaClock, FaMoneyBillWave, FaCheckCircle, FaTruck, FaSpinner } from "react-icons/fa";
import { getCurrentOrdersForVendor, updateOrderStatus } from "../../Services/apiServices";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VendorHome = () => {
    const { data: response = {}, isLoading, isError } = useQuery({
        queryKey: ['vendorOrders'],
        queryFn: getCurrentOrdersForVendor,
        refetchInterval: 5000,
    });

    const orders = response?.data || [];

    const getOrdersByStatus = (status) => {
        if (!Array.isArray(orders)) return 0;
        return orders.filter(order => 
            order?.status?.toUpperCase() === status.toUpperCase()
        ).length;
    };

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, orderId: null, newStatus: null, customerName: null });
    const queryClient = useQueryClient();

    const handleStatusChange = async (orderId, newStatus, customerName) => {
        setConfirmDialog({ isOpen: true, orderId, newStatus, customerName });
    };

    const confirmStatusChange = async () => {
        try {
            await updateOrderStatus({
                orderId: confirmDialog.orderId,
                status: confirmDialog.newStatus
            });
            await queryClient.invalidateQueries(['vendorOrders']);
            setConfirmDialog({ isOpen: false, orderId: null, newStatus: null, customerName: null });
        } catch (error) {
            console.error('Failed to update order status:', error);
            if (error.response?.data?.message) {
                console.log(error.response.data.message);
            } else {
                console.log('Failed to update order status. Please try again.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="ml-3">Loading orders...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-red-600">Failed to load orders. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Today</p>
                            <p className="text-lg font-semibold text-gray-700">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Today's Orders */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Orders Today</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{getOrdersByStatus('pending')}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <FaShoppingBag className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pending Orders */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{getOrdersByStatus('pending')}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <FaClock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{Array.isArray(orders) ? 
                                        orders.reduce((acc, order) => acc + (order?.billDetails?.finalAmount || 0), 0).toFixed(2)
                                    : '0.00'}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <FaMoneyBillWave className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Orders */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Live Orders</h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {Array.isArray(orders) && orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order.orderId} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                                                    ${order?.status?.toUpperCase() === 'PENDING' ? 'bg-purple-100 text-purple-800' : ''}
                                                    ${order?.status?.toUpperCase() === 'PREPARING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${order?.status?.toUpperCase() === 'ON THE WAY' ? 'bg-blue-100 text-blue-800' : ''}
                                                    ${order?.status?.toUpperCase() === 'DELIVERED' ? 'bg-green-100 text-green-800' : ''}
                                                    ${order?.status?.toUpperCase() === 'NOT RECEIVED BY CUSTOMER' ? 'bg-red-100 text-red-800' : ''}
                                                `}>
                                                    {order?.status?.toUpperCase() === 'PENDING' ? <FaClock className="w-4 h-4 mr-2" /> : ''}
                                                    {order?.status?.toUpperCase() === 'PREPARING' ? <FaSpinner className="w-4 h-4 mr-2 animate-spin" /> : ''}
                                                    {order?.status?.toUpperCase() === 'ON THE WAY' ? <FaTruck className="w-4 h-4 mr-2" /> : ''}
                                                    {order?.status?.toUpperCase() === 'DELIVERED' ? <FaCheckCircle className="w-4 h-4 mr-2" /> : ''}
                                                    {order?.status?.toUpperCase() === 'NOT RECEIVED BY CUSTOMER' ? <FaCheckCircle className="w-4 h-4 mr-2" /> : ''}
                                                    {order?.status}
                                                </span>
                                                <span className="text-lg font-semibold text-gray-900">{order.orderId}</span>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Customer</p>
                                                    <p className="text-base text-gray-900">{order.user.name}</p>
                                                    <p className="text-sm text-gray-500">{order.user.phoneNumber}</p>
                                                    <p className="text-sm text-gray-500">{order.user.address}</p>
                                                </div>

                                                <div className="bg-gray-100 rounded-lg p-4">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Order Items</p>
                                                    <ul className="space-y-2">
                                                        {order.items.map((item, idx) => (
                                                            <li key={idx} className="flex justify-between text-sm">
                                                                <span className="text-gray-700">
                                                                    {item.quantity}x {item.name}
                                                                    {item.customizations.length > 0 && (
                                                                    <ul className="text-xs text-gray-500">
                                                                        {item.customizations.map((custom, cidx) => (
                                                                            <li key={cidx}>{custom.fieldName}: {custom.selectedOption.name}</li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                                </span>
                                                                
                                                                <span className="text-gray-900 font-medium">
                                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                                </span>
                                                                
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                                                        <span className="font-medium">Total</span>
                                                        <span className="font-bold">₹{order.billDetails.finalAmount.toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                                                    <p className="text-base text-gray-900">{order.user.address}</p>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Order Time</p>
                                                    <p className="text-base text-gray-900">{new Date(order?.createdAt?.$date || order?.createdAt).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 self-start mt-4 md:mt-0">
                                            <select 
                                                value={order.status} 
                                                onChange={(e) => handleStatusChange(order.orderId, e.target.value, order.user.name)} 
                                                className="block w-full md:w-48 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="PREPARING">Preparing</option>
                                                <option value="ON THE WAY">On The Way</option>
                                                <option value="DELIVERED">Delivered</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">No live orders at the moment</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Confirmation Dialog */}
            <AnimatePresence>
                {confirmDialog.isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 p-3 rounded-full bg-blue-100">
                                    <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Update Order Status</h3>
                                <p className="text-gray-600 mb-2">
                                    Order ID: <span className="font-semibold">{confirmDialog.orderId}</span>
                                </p>
                                <p className="text-gray-600 mb-2">
                                    Customer: <span className="font-semibold">{confirmDialog.customerName}</span>
                                </p>
                                <p className="text-gray-600 mb-8">
                                    Are you sure you want to change the order status to{' '}
                                    <span className="font-semibold text-blue-600">{confirmDialog.newStatus}</span>?
                                </p>
                                <div className="flex gap-3 w-full">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setConfirmDialog({ isOpen: false, orderId: null, newStatus: null, customerName: null })}
                                        className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={confirmStatusChange}
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Confirm
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorHome;