import { useState } from 'react';
import PropTypes from 'prop-types';
import Header from '../../Components/Common/Header';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const OrderStatus = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'preparing': return 'bg-yellow-500';
      case 'on the way': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
      <span className="text-sm font-medium">{status}</span>
    </div>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.oneOf(['preparing', 'on the way', 'delivered']).isRequired,
};

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
              <OrderStatus status={order.status} />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(order.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">${order.total.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Total Amount</p>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="p-6">
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                </div>
                {item.addOns && item.addOns.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Add-ons: 
                      {item.addOns.map((addon, idx) => (
                        <span key={idx} className="inline-block px-2 py-1 ml-2 bg-gray-200 rounded-full text-xs">
                          {addon}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">x{item.quantity}</span>
                <p className="font-medium text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="mt-6 space-y-3 border-t border-dashed border-gray-200 pt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Platform Fee</span>
            <span>${order.platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h4 className="font-medium text-gray-800">Delivery Address</h4>
          </div>
          <p className="text-sm text-gray-600 ml-7">{order.address}</p>
        </div>
      </div>
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    status: PropTypes.oneOf(['preparing', 'on the way', 'delivered']).isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        addOns: PropTypes.arrayOf(PropTypes.string)
      })
    ).isRequired,
    subtotal: PropTypes.number.isRequired,
    tax: PropTypes.number.isRequired,
    platformFee: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired
  }).isRequired
};

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('current');

  // Example data - replace with actual API calls
  const currentOrders = [
    {
      id: '12345',
      date: new Date(),
      status: 'On the way',
      items: [
        {
          name: 'Margherita Pizza',
          quantity: 2,
          price: 12.99,
          addOns: ['Extra Cheese', 'Mushrooms']
        },
        {
          name: 'Garlic Bread',
          quantity: 1,
          price: 4.99,
        }
      ],
      subtotal: 30.97,
      tax: 2.48,
      platformFee: 1.99,
      total: 35.44,
      address: '123 Main St, Apt 4B, New York, NY 10001'
    }
  ];

  const previousOrders = [
    {
      id: '12344',
      date: new Date('2024-01-10T18:30:00'),
      status: 'delivered',
      items: [
        {
          name: 'Chicken Biryani',
          quantity: 1,
          price: 15.99,
          addOns: ['Extra Raita']
        },
        {
          name: 'Butter Naan',
          quantity: 2,
          price: 3.99,
        },
        {
          name: 'Mango Lassi',
          quantity: 1,
          price: 4.99,
        }
      ],
      subtotal: 28.96,
      tax: 2.32,
      platformFee: 1.99,
      total: 33.27,
      address: '123 Main St, Apt 4B, New York, NY 10001'
    },
    {
      id: '12343',
      date: new Date('2024-01-09T13:15:00'),
      status: 'delivered',
      items: [
        {
          name: 'Double Cheeseburger',
          quantity: 2,
          price: 11.99,
          addOns: ['Extra Patty', 'Bacon']
        },
        {
          name: 'French Fries',
          quantity: 1,
          price: 4.99,
        },
        {
          name: 'Chocolate Milkshake',
          quantity: 2,
          price: 5.99,
        }
      ],
      subtotal: 40.95,
      tax: 3.28,
      platformFee: 1.99,
      total: 46.22,
      address: '123 Main St, Apt 4B, New York, NY 10001'
    },
    {
      id: '12342',
      date: new Date('2024-01-08T20:45:00'),
      status: 'delivered',
      items: [
        {
          name: 'Pepperoni Pizza',
          quantity: 1,
          price: 14.99,
          addOns: ['Extra Cheese']
        },
        {
          name: 'Caesar Salad',
          quantity: 1,
          price: 8.99,
        },
        {
          name: 'Garlic Knots',
          quantity: 1,
          price: 5.99,
        }
      ],
      subtotal: 29.97,
      tax: 2.40,
      platformFee: 1.99,
      total: 34.36,
      address: '123 Main St, Apt 4B, New York, NY 10001'
    }
  ];

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
              onChange={(date) => setSelectedDate(date)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              dateFormat="MMMM d, yyyy"
            />
          </div>
        )}

        <div className="space-y-6">
          {activeTab === 'current'
            ? currentOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            : previousOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
        </div>
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