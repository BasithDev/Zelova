import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import Header from '../../Components/Common/Header';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getCurrentOrders, userUpdateOrderStatus, getPreviousOrdersOnDate } from '../../Services/apiServices';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderCard } from '../../Components/Orders/OrderCard';
import { FaBoxOpen } from 'react-icons/fa';

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('current');
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [previousOrders, setPreviousOrders] = useState([]);
  const queryClient = useQueryClient();

  const handleOrderResponse = async (wasReceived) => {
    try {
      const newStatus = wasReceived ? 'ORDER ACCEPTED' : 'NOT RECEIVED BY CUSTOMER';
      await userUpdateOrderStatus({
        orderId: selectedOrderId,
        status: newStatus
      });
      await queryClient.invalidateQueries(['currentOrders']);
      setShowDeliveryPopup(false);
      setSelectedOrderId(null);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const fetchPreviousOrders = async (date) => {
    try {
      const data = await getPreviousOrdersOnDate(date.toISOString());
      setPreviousOrders(data.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'previous') {
      fetchPreviousOrders(selectedDate);
    }
  }, [activeTab, selectedDate]);

  const { data: currentOrders, isLoading, isError } = useQuery({
    queryKey: ['currentOrders'],
    queryFn: getCurrentOrders,
    refetchInterval: 5000,
    select: (data) => data.data
  });

  const renderContent = () => {
    
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-red-600">Failed to load orders. Please try again later.</p>
          </div>
        </div>
      );
    }

    if (activeTab === 'current' && !currentOrders?.orders?.length) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found Currently.</h3>
            <p className="text-gray-600">{`You haven't placed any orders.`}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {activeTab === 'current'
          ? currentOrders.orders.map((order) => (
              <OrderCard 
                key={order.orderId} 
                order={order} 
                setShowDeliveryPopup={setShowDeliveryPopup}
                setSelectedOrderId={setSelectedOrderId}
                isPreviousOrder={false}
              />
            ))
          : (Array.isArray(previousOrders) && previousOrders.length > 0 ? previousOrders.map((order) => {
              return (
                <OrderCard 
                  key={order._id} 
                  order={order} 
                  setShowDeliveryPopup={setShowDeliveryPopup}
                  setSelectedOrderId={setSelectedOrderId}
                  isPreviousOrder={true}
                />
              );
             }) : 
             <div className="flex flex-col items-center justify-center py-12">
               <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center">
                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No Previous Orders</h3>
                 <p className="text-gray-600">{`You haven't placed any orders on this date.`}</p>
                 <FaBoxOpen className="text-6xl text-gray-300 mt-4" />
               </div>
             </div>
             )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        placeholderText="Search foods, restaurants, etc..."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Your Orders</h1>
          <div className="inline-flex rounded-lg p-1 bg-gray-100">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'current'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Current Orders
            </button>
            <button
              onClick={() => setActiveTab('previous')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'previous'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Previous Orders
            </button>
          </div>
        </div>

        {activeTab === 'previous' && (
          <div className="mb-6">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                fetchPreviousOrders(date);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              dateFormat="MMMM d, yyyy"
            />
          </div>
        )}

        {renderContent()}

        <AnimatePresence>
          {showDeliveryPopup && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
              >
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                    className="mb-4 p-3 rounded-full bg-blue-100"
                  >
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <motion.h3 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl font-semibold text-gray-900 mb-2"
                  >
                    Delivery Confirmation
                  </motion.h3>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 mb-6"
                  >
                    Has your order been delivered to you?
                  </motion.p>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-3 w-full"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOrderResponse(false)}
                      className="flex-1 px-6 py-3 text-white bg-red-600 rounded-xl font-medium hover:bg-red-700 transition-colors"
                    >
                      No, Not Received
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOrderResponse(true)}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                    >
                      Yes, Received
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

Orders.propTypes = {
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
  placeholderText: PropTypes.string
};

Orders.defaultProps = {
  searchQuery: '',
  onSearchChange: () => {},
  placeholderText: 'Search foods, restaurants, etc...'
};

export default Orders;