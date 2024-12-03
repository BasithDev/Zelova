import { useState } from "react";
import { FaShoppingBag, FaClock, FaMoneyBillWave, FaCheckCircle, FaTruck, FaSpinner } from "react-icons/fa";

const VendorHome = () => {
    const [todayOrders, setTodayOrders] = useState(35);
    const [pendingOrders, setPendingOrders] = useState(5);
    const [liveOrders, setLiveOrders] = useState([
        {
            _id: { $oid: "674ecdb44d0d1674cedcf68e" },
            userId: { $oid: "673740bffb1956e9918d1bb5" },
            restaurantId: { $oid: "673743dae0b2e041d53cece2" },
            cartId: { $oid: "6749c4f39dd38234ae1ff6f9" },
            user: {
                name: "User Test 1",
                phoneNumber: "8590871519",
                address: "KNRA-57, Lane-4, Shastri Nagar, Maradu, Kochi, Ernakulam, Kerala 682304, India"
            },
            items: [
                {
                    name: "Choca Lava Cake",
                    quantity: 7,
                    price: 119,
                    totalPrice: 833,
                    customizations: [],
                    _id: { $oid: "674ecdb44d0d1674cedcf68f" }
                },
                {
                    name: "Grilled Bucket",
                    quantity: 1,
                    price: 798,
                    totalPrice: 798,
                    customizations: [
                        {
                            fieldName: "Choose Bucket Size",
                            selectedOption: {
                                name: "6Pcs",
                                price: 399
                            },
                            _id: { $oid: "674ecdb44d0d1674cedcf691" }
                        }
                    ],
                    _id: { $oid: "674ecdb44d0d1674cedcf690" }
                }
            ],
            billDetails: {
                itemTotal: 1381.1,
                platformFee: 8,
                deliveryFee: 0,
                tax: 69.05,
                discount: 0,
                offerSavings: 249.9,
                totalSavings: 289.9,
                finalAmount: 1458.155,
                paymentMethod: "COD"
            },
            status: "PENDING",
            rating: 0,
            orderId: "ZEL-20241203-5798",
            createdAt: { $date: "2024-12-03T09:21:56.777Z" },
            updatedAt: { $date: "2024-12-03T09:21:56.777Z" },
            __v: 0
        }
    ]);
    const [totalRevenue, setTotalRevenue] = useState(1230.50);
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (date) => {
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setIsLoading(true);
        setLiveOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.orderId === orderId ? { ...order, status: newStatus } : order
            )
        );
        setTimeout(() => setIsLoading(false), 500); // Simulated API delay
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'preparing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'done':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'sent for delivery':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'preparing':
                return <FaSpinner className="animate-spin" />;
            case 'done':
                return <FaCheckCircle />;
            case 'sent for delivery':
                return <FaTruck />;
            default:
                return <FaClock />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Today</p>
                            <p className="text-lg font-semibold text-gray-700">{formatDate(new Date())}</p>
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
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{todayOrders}</p>
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
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{pendingOrders}</p>
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
                                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalRevenue.toFixed(2)}</p>
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
                        {isLoading ? (
                            <div className="p-6 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-4 text-gray-500">Updating orders...</p>
                            </div>
                        ) : liveOrders.length === 0 ? (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">No live orders at the moment</p>
                            </div>
                        ) : (
                            liveOrders.map((order) => (
                                <div key={order.orderId} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)} gap-2`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
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

                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-sm font-medium text-gray-500 mb-2">Order Items</p>
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
                                                    <p className="text-base text-gray-900">{formatTime(order.createdAt.$date)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                                                className="block w-full px-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                disabled={isLoading}
                                            >
                                                <option value="Preparing">Preparing</option>
                                                <option value="Done">Done</option>
                                                <option value="Sent for Delivery">Sent for Delivery</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VendorHome;