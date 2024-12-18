import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaBoxOpen } from 'react-icons/fa';
import { getPreviousOrdersOnDateForVendor } from "../../Services/apiServices";
import {OrderCard} from '../../Components/Orders/OrderCard';

const Orders = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [previousOrders, setPreviousOrders] = useState([]);

  const fetchPreviousOrders = async (date) => {
    try {
      const data = await getPreviousOrdersOnDateForVendor(date.toISOString());
      setPreviousOrders(data.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchPreviousOrders(selectedDate);
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Previous Orders</h1>
        <div className="mb-8">
          <label className="block text-gray-700 mb-2">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            maxDate={new Date()}
            dateFormat="yyyy/MM/dd"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-6">
          {previousOrders.length > 0 ? previousOrders.map((order) => (
            <OrderCard key={order._id} order={order} isPreviousOrder={true} fromSeller={true} />
          )) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
                <p className="text-gray-600">No orders were placed on this date.</p>
                <FaBoxOpen className="text-6xl text-gray-300 mt-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;