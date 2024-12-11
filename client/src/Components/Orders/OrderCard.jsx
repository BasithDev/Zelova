import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { rateRestaurant } from '../../Services/apiServices';
import { toast } from 'react-toastify';

const OrderStatus = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'preparing': return 'bg-yellow-500';
      case 'on the way': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      case 'not delivered': return 'bg-red-500';
      case 'not received by customer': return 'bg-red-500';
      default: return 'bg-purple-500';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`h-3 w-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
      <span className="text-sm font-medium">{status}</span>
    </div>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.oneOf(['PENDING','PAID','PREPARING', 'ON THE WAY', 'DELIVERED', 'NOT RECEIVED BY CUSTOMER', 'NOT DELIVERED']).isRequired,
};

const OrderCard = ({ order, setShowDeliveryPopup, setSelectedOrderId, isPreviousOrder, fromSeller  }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [localOrder, setOrder] = useState(order);

  useEffect(() => {
    if (order.status?.toUpperCase() === 'DELIVERED') {
      setShowDeliveryPopup(true);
      setSelectedOrderId(order.orderId);
    }
  }, [order.status, setShowDeliveryPopup, setSelectedOrderId, order.orderId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleRateRestaurant = async (orderId,restaurantId,rating) => {
    try {
      await rateRestaurant({orderId, restaurantId, rating});
      toast.success('Restaurant rated successfully!');

      // Update local state to reflect the rating immediately
      setSelectedRating(rating);
      setOrder(prevOrder => ({
        ...prevOrder,
        restaurantRate: {
          ...prevOrder.restaurantRate,
          status: true,
          value: rating
        }
      }));

      setIsModalOpen(false);
    } catch (error) {
      toast.error('Error rating restaurant');
      console.error('Error rating restaurant:', error);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-800">Order #{localOrder.orderId}</h3>
              {isPreviousOrder ? (
                <span className="text-md font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">{localOrder.status}</span>
              ) : (
                <OrderStatus status={localOrder.status} />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(localOrder.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">₹{localOrder.billDetails.finalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Total Amount</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {localOrder.items.map((item, index) => (
            <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                </div>
                {item.customizations && item.customizations.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Customizations: 
                      {item.customizations.map((customization, idx) => (
                        <span key={idx} className="inline-block px-2 py-1 ml-2 bg-gray-200 rounded-full text-xs">
                          {customization.fieldName}: {customization.selectedOption.name}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm text-gray-600">x{item.quantity}</span>
                <p className="font-medium text-gray-800">₹{item.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t border-dashed border-gray-200 pt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Item Total</span>
            <span>₹{localOrder.billDetails.itemTotal.toFixed(2)}</span>
          </div>
          {localOrder.billDetails.deliveryFee > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Fee</span>
              <span>₹{localOrder.billDetails.deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Platform Fee</span>
            <span>₹{localOrder.billDetails.platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax</span>
            <span>₹{localOrder.billDetails.tax.toFixed(2)}</span>
          </div>
          {localOrder.billDetails.totalSavings > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Total Savings</span>
              <span>-₹{localOrder.billDetails.totalSavings.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-800 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>₹{localOrder.billDetails.finalAmount.toFixed(2)}</span>
          </div>
          <div className="text-gray-600 text-md">
          Payment Method: <span className='font-bold text-xl'>{localOrder.billDetails.paymentMethod}</span>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h4 className="font-medium text-gray-800">Delivery Address</h4>
          </div>
          <p className="text-sm text-gray-600 ml-7">{localOrder.user.address}</p>
        </div>
      </div>
      {isPreviousOrder && !fromSeller && (
        <div className="mt-4 p-6">
          {localOrder.restaurantRate?.status ? (
            <button className="font-semibold text-white px-4 py-2 flex items-center gap-2 bg-yellow-500 rounded-md cursor-not-allowed">
              Restaurant Rated <FaStar />
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
              onClick={openModal}
            >
              Rate the Restaurant
            </button>
          )}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white w-96 rounded-2xl shadow-2xl p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Rate your experience at</h2>
                <p className="text-xl text-blue-600 font-semibold mb-8">{localOrder.restaurantName}</p>
                
                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onHoverStart={() => setHoveredRating(star)}
                      onHoverEnd={() => setHoveredRating(0)}
                    >
                      <FaStar
                        className={`h-10 w-10 cursor-pointer transition-colors duration-200 ${
                          hoveredRating >= star || selectedRating >= star
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                        onClick={() => handleStarClick(star)}
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <button
                    className="px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    onClick={closeModal}
                  >
                    Do Later
                  </button>
                  <button
                    className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                      selectedRating > 0 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={selectedRating === 0}
                    onClick={() => {
                      handleRateRestaurant( localOrder._id, localOrder.restaurantId, selectedRating);
                      closeModal();
                    }}
                  >
                    Submit Rating
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    restaurantId: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['PENDING','PAID','PREPARING', 'ON THE WAY', 'DELIVERED', 'NOT RECEIVED BY CUSTOMER', 'NOT DELIVERED', 'ORDER ACCEPTED']).isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        totalPrice: PropTypes.number.isRequired,
        customizations: PropTypes.arrayOf(
          PropTypes.shape({
            fieldName: PropTypes.string.isRequired,
            selectedOption: PropTypes.shape({
              name: PropTypes.string.isRequired,
              price: PropTypes.number.isRequired
            }).isRequired
          })
        )
      })
    ).isRequired,
    billDetails: PropTypes.shape({
      itemTotal: PropTypes.number.isRequired,
      deliveryFee: PropTypes.number.isRequired,
      platformFee: PropTypes.number.isRequired,
      tax: PropTypes.number.isRequired,
      totalSavings: PropTypes.number.isRequired,
      finalAmount: PropTypes.number.isRequired,
      paymentMethod: PropTypes.string.isRequired
    }).isRequired,
    orderId: PropTypes.string.isRequired,
    user: PropTypes.shape({
      address: PropTypes.string.isRequired
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    restaurantName: PropTypes.string.isRequired,
    restaurantRate: PropTypes.shape({
      status: PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  setShowDeliveryPopup: PropTypes.func.isRequired,
  setSelectedOrderId: PropTypes.func.isRequired,
  isPreviousOrder: PropTypes.bool,
  fromSeller: PropTypes.bool,
};

export { OrderStatus, OrderCard };
