import { FaShoppingCart, FaSearch } from "react-icons/fa";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from 'react';
import { useCart } from "../../Hooks/useCart";
import { searchFoodItems } from "../../Services/apiServices";

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

const Header = ({ placeholderText = "Search..." }) => {
    const navigate = useNavigate();
    const { totalItems } = useCart();
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const debounceRef = useRef(null);
    const totalItemsCount = totalItems?.data?.totalItems || 0;

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            if (searchQuery) {
                try {
                    const response = await searchFoodItems(searchQuery);
                    setSearchResults(response.data.foodItems);
                    setShowSearchDropdown(true);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                    setSearchResults([]);
                }
            } else {
                setSearchResults([]);
                setShowSearchDropdown(false);
            }
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.search-container')) {
                setShowSearchDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSearchItemClick = (item) => {
        setShowSearchDropdown(false);
        setSearchQuery('');
        navigate(`/restaurant/${item.restaurantId._id}/menu`, { state: { foodCategory: item.foodCategory.name } });
    };

    return (
        <div className="sticky top-0 z-40 bg-white transition-all duration-300 border-b-2 pt-1">
            <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                    <div className="flex-1 max-w-3xl">
                        <div className="relative search-container">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={placeholderText}
                                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                            />
                            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <FaSearch size={16} />
                            </div>

                            <AnimatePresence>
                                {showSearchDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[80vh] sm:max-h-96 overflow-y-auto z-50 scrollbar-hide"
                                    >
                                        <AnimatePresence>
                                        {searchResults.length > 0 ? (
                                            searchResults.map((item) => (
                                                <motion.div
                                                    key={item._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0, y: -100 }}
                                                    transition={{ duration: 0.2 }}
                                                    onClick={() => handleSearchItemClick(item)}
                                                    className="flex items-center p-2 sm:p-3 transition-all duration-200 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-orange-50 hover:shadow-lg"
                                                >
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden mr-2 sm:mr-3">
                                                        <AnimatePresence>
                                                        <motion.img
                                                            initial={{ scale: 0.8 }}
                                                            animate={{ scale: 1 }}
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        </AnimatePresence>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-base sm:text-lg text-gray-800 truncate">{item.name}</h3>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs sm:text-sm text-orange-500 truncate">
                                                               From: <span className="text-gray-500 font-semibold">{item.restaurantId?.name} 
                                                               <span className="hidden sm:inline text-gray-400 ms-1 font-normal">{item.restaurantId?.address}</span></span> 
                                                            </span>
                                                            <motion.span 
                                                                className="text-sm font-medium text-orange-500 ml-2 whitespace-nowrap"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                            >
                                                                ₹{item.price}
                                                            </motion.span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="p-3 text-center text-gray-500 text-sm sm:text-base">
                                                {`No results found for "${searchQuery}"`}
                                            </div>
                                        )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onMouseEnter={() => setShowCartDropdown(true)}
                            onClick={() => navigate('/cart')}
                            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 hover:bg-orange-100 rounded-full transition-all duration-300 group"
                        >
                            <FaShoppingCart className="text-orange-500 group-hover:text-orange-600 transition-colors" size={18} />
                            {totalItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
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
    placeholderText: PropTypes.string
};

export default Header;
