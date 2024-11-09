import { useState } from "react";

const VendorHome = () => {
    const [todayOrders, setTodayOrders] = useState(35);
    const [pendingOrders, setPendingOrders] = useState(5);
    const [liveOrders, setLiveOrders] = useState([
        {
            orderId: "ORD12345",
            items: [
                { name: "Burger", quantity: 2, price: 5.99 },
                { name: "Fries", quantity: 1, price: 2.49 },
            ],
            totalPrice: 14.47,
            status: "Preparing",
            address: "123 Vendor St, City, Country",
        },
        {
            orderId: "ORD12346",
            items: [
                { name: "Pizza", quantity: 1, price: 8.99 },
                { name: "Soda", quantity: 2, price: 1.49 },
            ],
            totalPrice: 11.97,
            status: "Sent for Delivery",
            address: "456 Customer Rd, City, Country",
        },
    ]);
    const [totalRevenue, setTotalRevenue] = useState(1230.50);

    const formatDate = (date) => {
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString(undefined, options);
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setLiveOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.orderId === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    return (
        <div className="flex ms-[20%] flex-col bg-gray-50">

            {/* Today's Date - Top Right */}
            <div className="text-right p-6 text-xl font-semibold text-gray-700">
                {formatDate(new Date())}
            </div>

            <main className="flex-1 p-6 space-y-8">

                {/* Today's Orders and Pending Orders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Today's Orders Card */}
                    <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-50 hover:cursor-pointer">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Today Orders</h3>
                        <p className="text-lg font-medium text-gray-600">{todayOrders} Orders</p>
                        <div className="mt-4 text-sm text-gray-400 opacity-75">
                            <svg className="w-6 h-6 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Pending Orders Card */}
                    <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-50 hover:cursor-pointer">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Pending Orders</h3>
                        <p className="text-lg font-medium text-gray-600">{pendingOrders} Orders</p>
                        <div className="mt-4 text-sm text-gray-400 opacity-75">
                            <svg className="w-6 h-6 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>
                {/* Total Revenue Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-700">Total Revenue</h3>
                    <p className="text-2xl font-bold text-gray-700">${totalRevenue.toFixed(2)}</p>
                </div>
                {/* Live Orders Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Live Orders To Compelete</h3>

                    {liveOrders.length === 0 ? (
                        <p className="text-center text-gray-500">No live orders at the moment.</p>
                    ) : (
                        liveOrders.map((order) => (
                            <div key={order.orderId} className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-lg font-semibold text-gray-700">Order ID: {order.orderId}</p>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                                        className="bg-white border rounded-lg px-4 py-2"
                                    >
                                        <option value="Preparing">Preparing</option>
                                        <option value="Done">Done</option>
                                        <option value="Sent for Delivery">Sent for Delivery</option>
                                    </select>
                                </div>

                                {/* Items List */}
                                <ul className="space-y-2 mb-4">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between text-gray-600">
                                            <span>{item.name} x{item.quantity}</span>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Total Price */}
                                <div className="flex justify-between text-lg font-semibold text-gray-700 mb-2">
                                    <span>Total Price</span>
                                    <span>${order.totalPrice.toFixed(2)}</span>
                                </div>

                                {/* Address */}
                                <div className="text-gray-600">
                                    <p className="font-semibold">Delivery Address:</p>
                                    <p>{order.address}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </main>
        </div>
    );
};

export default VendorHome;