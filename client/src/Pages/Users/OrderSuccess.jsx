import { useEffect, useState } from 'react';
import { FaCheckCircle, FaHome } from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const OrderSuccess = () => {
    const location = useLocation();
    const { orderId, coinsWon } = location.state || {};
    const navigate = useNavigate();
    const [scratched, setScratched] = useState(false);
    const [displayedCoins, setDisplayedCoins] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (scratched && coinsWon) {
                let count = 0;
                const interval = setInterval(() => {
                    count += Math.ceil(coinsWon / 20);
                    if (count >= coinsWon) {
                        setDisplayedCoins(coinsWon);
                        clearInterval(interval);
                    } else {
                        setDisplayedCoins(count);
                    }
                }, 50);
                return () => clearInterval(interval);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [scratched, coinsWon]);

    const handleGoToOrders = () => {
        navigate('/orders');
    };

    const handleGoToHome = () => {
        navigate('/');
    };

    const handleScratch = () => {
        setScratched(true);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md text-center p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center bg-white"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                    }}
                    className="relative"
                >
                    <div className="absolute -inset-1 bg-green-500 rounded-full opacity-20 animate-pulse" />
                    <FaCheckCircle className="text-green-500 w-16 sm:w-20 h-16 sm:h-20 relative" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 space-y-2"
                >
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">Order Placed Successfully!</h1>
                    <p className="text-base sm:text-lg text-gray-700">
                        Order ID: <span className="font-semibold">{orderId}</span>
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                        Your order is being prepared. Track its status on the orders page.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!scratched ? (
                        <motion.div 
                            key="scratch-card"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="mt-8 w-full sm:w-80"
                        >
                            <motion.div
                                onClick={handleScratch}
                                className="relative w-full h-32 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-xl cursor-pointer shadow-lg overflow-hidden group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm group-hover:backdrop-blur-0 transition-all duration-300" />
                                <div className="relative h-full flex items-center justify-center">
                                    <p className="text-lg sm:text-xl text-white font-bold px-4 text-center">
                                        Scratch to Reveal Your Reward!
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="reward-reveal"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 w-full sm:w-80 h-32 bg-gradient-to-r from-purple-100 to-orange-100 rounded-xl flex items-center justify-center p-4 shadow-inner"
                        >
                            <div className="text-center">
                                <p className="text-lg sm:text-xl text-gray-800">
                                    Congratulations! 🎉
                                </p>
                                <p className="text-2xl sm:text-3xl font-bold text-orange-500 mt-2">
                                    +{displayedCoins} coins
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-8 w-full grid grid-cols-2 gap-4">
                    <motion.button 
                        onClick={handleGoToHome}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FaHome className="text-lg" />
                        <span className="text-sm sm:text-base">Home</span>
                    </motion.button>
                    <motion.button 
                        onClick={handleGoToOrders}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <MdRestaurant className="text-lg" />
                        <span className="text-sm sm:text-base">Track Order</span>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
