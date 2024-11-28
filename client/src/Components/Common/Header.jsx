import { FaShoppingCart, FaSearch, FaChevronRight } from "react-icons/fa";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';

const CartDropdown = ({ items, restaurant, onClose }) => {
    const calculateSubtotal = () => {
        return items.reduce((total, item) => {
            const itemTotal = (item.price + (item.selectedCustomizations?.reduce((acc, customName) => {
                const option = item.customOptions?.find(opt => opt.name === customName);
                return acc + (option?.price || 0);
            }, 0) || 0)) * item.quantity;
            return total + itemTotal;
        }, 0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
            onMouseLeave={onClose}
        >
            <div className="max-h-96 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        Your cart is empty
                    </div>
                ) : (
                    <>
                        {/* Restaurant Info */}
                        <div className="px-4 py-3 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <img 
                                    src={restaurant.image} 
                                    alt={restaurant.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-medium text-gray-900">{restaurant.name}</h3>
                                    <p className="text-xs text-gray-500">{restaurant.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {item.selectedCustomizations?.length > 0 && (
                                                    <div className="text-xs text-gray-500">
                                                        Add-ons: {item.selectedCustomizations.join(", ")}
                                                    </div>
                                                )}
                                                <div className="mt-1">
                                                    Qty: {item.quantity}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900">
                                                ₹{((item.price + (item.selectedCustomizations?.reduce((acc, customName) => {
                                                    const option = item.customOptions?.find(opt => opt.name === customName);
                                                    return acc + (option?.price || 0);
                                                }, 0) || 0)) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="p-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900">Subtotal</span>
                                <span className="font-medium text-gray-900">₹{calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                                *Final total may vary based on delivery fees and offers
                            </p>
                            <button
                                onClick={() => onClose()}
                                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 group"
                            >
                                Go to Cart
                                <FaChevronRight className="group-hover:translate-x-1 transition-transform" size={12} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

CartDropdown.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired,
            selectedCustomizations: PropTypes.arrayOf(PropTypes.string),
            customOptions: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    price: PropTypes.number.isRequired
                })
            )
        })
    ).isRequired,
    restaurant: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired
};

const Header = ({ searchQuery, onSearchChange, placeholderText = "Search..." }) => {
    const navigate = useNavigate();
    const [showCartDropdown, setShowCartDropdown] = useState(false);

    const cartItems = [
        {
            id: 1,
            name: "Chicken Burger",
            price: 150,
            quantity: 2,
            selectedCustomizations: ["Extra cheese", "Spicy mayo"],
            customOptions: [
                { name: "Extra cheese", price: 30 },
                { name: "Spicy mayo", price: 20 }
            ]
        },
        {
            id: 2,
            name: "French Fries",
            price: 100,
            quantity: 1,
            selectedCustomizations: ["Extra masala"],
            customOptions: [
                { name: "Extra masala", price: 10 }
            ]
        }
    ];

    // Example restaurant data - replace with your actual restaurant data
    const restaurant = {
        id: 1,
        name: "Burger King",
        image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1815&q=80",
        location: "Indiranagar, Bangalore"
    };

    // Calculate total quantity of items
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="sticky top-0 z-50 bg-white transition-all duration-300 border-b-2 pt-1">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-3xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={onSearchChange}
                                placeholder={placeholderText}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <FaSearch size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="relative ml-4">
                        <button
                            onMouseEnter={() => setShowCartDropdown(true)}
                            onClick={() => navigate('/cart')}
                            className="flex items-center justify-center w-12 h-12 bg-orange-50 hover:bg-orange-100 rounded-full transition-all duration-300 group"
                        >
                            <FaShoppingCart className="text-orange-500 group-hover:text-orange-600 transition-colors" size={20} />
                            {totalQuantity > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {totalQuantity}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showCartDropdown && (
                                <CartDropdown 
                                    items={cartItems}
                                    restaurant={restaurant}
                                    onClose={() => setShowCartDropdown(false)}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

Header.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    placeholderText: PropTypes.string
};

Header.defaultProps = {
    placeholderText: "Search..."
};

export default Header;
