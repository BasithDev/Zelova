import { FaShoppingCart, FaSearch } from "react-icons/fa";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';
import { useCart } from "../../Hooks/useCart";

const CartDropdown = ({ onClose }) => {
    const navigate = useNavigate();
    const { cart } = useCart();
    const cartData = cart?.data?.cart;

    const calculateSubtotal = () => {
        if (!cartData?.items) return 0;
        return cartData.totalPrice;
    };

    if (!cartData || !cartData.items || cartData.items.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                onMouseLeave={onClose}
            >
                <div className="p-4 text-center text-gray-500">
                    Your cart is empty
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            onMouseLeave={onClose}
        >
            <div className="p-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                    <img 
                        src={cartData.restaurantId.image} 
                        alt={cartData.restaurantId.name}
                        className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-800">{cartData.restaurantId.name}</h3>
                        <p className="text-sm text-gray-500 truncate max-w-[250px]">{cartData.restaurantId.address}</p>
                    </div>
                </div>

                <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                    {cartData.items.map((item) => (
                        <div key={item._id} className="flex items-center gap-3">
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{item.item.name}</h4>
                                {item.selectedCustomizations?.length > 0 && (
                                    <p className="text-sm text-gray-500">
                                        {item.selectedCustomizations.map(customization => (
                                            `${customization.fieldName}: ${customization.options.name}`
                                        )).join(", ")}
                                    </p>
                                )}
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm font-medium text-gray-900">
                                        ₹{item.itemPrice} × {item.quantity}
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        ₹{item.itemPrice * item.quantity}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between font-medium text-gray-900">
                        <span>Subtotal</span>
                        <span>₹{calculateSubtotal()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Note: Prices may vary after offers and taxes</p>
                    <button
                        onClick={() => navigate('/cart')}
                        className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                        View Cart
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

CartDropdown.propTypes = {
    onClose: PropTypes.func.isRequired
};

const Header = ({ searchQuery, onSearchChange, placeholderText = "Search..." }) => {
    const navigate = useNavigate();
    const { totalItems } = useCart();
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const totalItemsCount = totalItems?.data?.totalItems || 0;

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
                            {totalItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {totalItemsCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showCartDropdown && (
                                <CartDropdown 
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
