import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useCart } from "../Hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';

const CartSnackbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalItems, totalPrice } = useCart();
    const [isVisible, setIsVisible] = useState(true);
    
    const totalItemsCount = totalItems?.data?.totalItems || 0;
    const totalPriceCount = totalPrice?.data?.totalPrice || 0;

    const shouldShowSnackbar = totalItemsCount > 0 && location.pathname !== '/cart' && isVisible;

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => setIsVisible(true), 8000);
    };

    return (
        <AnimatePresence>
            {shouldShowSnackbar && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-orange-500 text-white rounded-lg shadow-lg z-50"
                >
                    <motion.button
                        className="absolute -top-2 -right-2 bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                        onClick={handleClose}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <IoMdClose className="text-lg" />
                    </motion.button>
                    <div className="p-4 flex items-center justify-between">
                        <motion.div 
                            className="flex items-center gap-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="relative">
                                <FaShoppingCart className="text-2xl" />
                                <motion.span 
                                    key={totalItemsCount}
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-green-600 text-md text-white rounded-full w-5 h-5 flex items-center justify-center font-bold"
                                >
                                    {totalItemsCount}
                                </motion.span>
                            </div>
                            <motion.div
                                key={totalPriceCount}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <span className="font-bold">₹{totalPriceCount.toFixed(2)}</span>
                            </motion.div>
                        </motion.div>
                        <motion.button 
                            onClick={() => navigate('/cart')}
                            className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            View Cart
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartSnackbar;
