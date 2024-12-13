import { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
    const location = useLocation();
    const { orderId, coinsWon } = location.state || {};
    const navigate = useNavigate();
    const [scratched, setScratched] = useState(false);
    const [displayedCoins, setDisplayedCoins] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            // Logic to stop the tick animation after it runs once
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleGoToOrders = () => {
        navigate('/orders');
    };

    const handleScratch = () => {
        setScratched(true);
        setDisplayedCoins(coinsWon || 0);
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gray-50"
        >
            <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center p-8 rounded-3xl shadow-2xl flex flex-col items-center bg-white">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaCheckCircle className="text-green-500 w-20 h-20 mb-4" />
                </motion.div>
                <h1 className="text-4xl font-bold text-gray-800">Order Placed Successfully!</h1>
                <p className="text-lg text-gray-700 mt-4">Your Order ID: <span className="font-semibold">{orderId}</span></p>
                <p className="text-md text-gray-600 mt-2">Your order is being prepared. You can check the status on orders page</p>

                <div className="mt-8">
                    {!scratched ? (
                        <div 
                            onClick={handleScratch} 
                            className="w-64 h-32 bg-purple-300 rounded-lg flex items-center justify-center cursor-pointer shadow-inner p-2"
                        >
                            <p className="text-xl text-orange-900 font-bold">Click to Reveal Your Surprise!</p>
                        </div>
                    ) : (
                        <div className="w-64 h-32 p-2 bg-purple-100 rounded-lg flex items-center justify-center shadow-inner">
                            <p className="text-lg text-purple-900">Congratulations! You&apos;ve won <span className="font-bold">{displayedCoins}</span> coins!</p>
                        </div>
                    )}
                </div>

                <div className="mt-10 space-x-4">
                    <button 
                        onClick={handleGoToOrders} 
                        className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Go to Orders
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
