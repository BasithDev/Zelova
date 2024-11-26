import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SearchBarWithCart = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    // Fake data for demonstration
    const restaurantName = "KFC";
    const restaurantAddress = "123 Main St, City";
    const cartItems = [
        { name: "Item 1", price: 150, quantity: 2 },
        { name: "Item 2", price: 200, quantity: 1 }
    ];
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleMouseEnter = () => {
        setDropdownVisible(true);
    };

    const handleMouseLeave = (e) => {
        const dropdownElement = dropdownRef.current;
        const containerElement = containerRef.current;
        
        if (!dropdownElement || !containerElement) return;
        
        const isMouseInDropdown = dropdownElement.contains(e.relatedTarget);
        const isMouseInContainer = containerElement.contains(e.relatedTarget);
        
        if (!isMouseInDropdown && !isMouseInContainer) {
            setDropdownVisible(false);
        }
    };

    return (
        <div className="flex items-center w-full bg-white rounded-md p-2 relative">
            <input
                type="text"
                value=""
                onChange={() => {}}
                placeholder="Search..."
                className="flex-grow px-4 py-2.5 bg-gray-200 placeholder:text-gray-400 rounded-md focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500 text-xl"
            />
            <div 
                ref={containerRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                onClick={() => navigate('/cart')}
                className="bg-orange-500 flex items-center justify-center rounded-md p-3 cursor-pointer hover:bg-orange-600 transition duration-300 ml-2 relative">
                    <FaShoppingCart className="text-white text-2xl" />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </div>
                </div>
                <AnimatePresence>
                    {isDropdownVisible && (
                        <motion.div 
                            ref={dropdownRef}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-72 mt-2 right-0 z-50" 
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Arrow pointing to cart icon */}
                            <div className="absolute -top-3 right-6 w-4 h-4 bg-white border-t border-l border-gray-300 transform rotate-45 z-40"></div>
                            
                            <div className="relative z-50 bg-white">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <span className='text-lg font-medium text-gray-600'>From</span> 
                                    {restaurantName}
                                </h2>
                                <p className="mb-4 font-medium text-gray-500">{restaurantAddress}</p>
                                
                                <div className="max-h-64 overflow-y-auto mb-4">
                                    <ul className="divide-y divide-gray-200">
                                        {cartItems.map((item, index) => (
                                            <motion.li 
                                                key={index} 
                                                className="py-3 group hover:bg-orange-50 transition-colors duration-200 rounded-md"
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="flex justify-between items-center px-2">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <p className="text-orange-500 font-medium">₹{item.price * item.quantity}</p>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700 text-lg font-bold">Subtotal</span>
                                        <span className="text-xl font-bold text-gray-900">₹{subtotal}</span>
                                    </div>
                                    <p className="text-gray-500 text-md mb-4">Extra charges may apply</p>
                                    
                                    <motion.button 
                                        className="bg-orange-500 text-white w-full rounded-md px-4 py-3 font-semibold hover:bg-orange-600 transition duration-300 flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/cart')}
                                    >
                                        View Cart
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

SearchBarWithCart.propTypes = {
};

export default SearchBarWithCart;