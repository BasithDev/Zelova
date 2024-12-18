import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';

const CartSnackbar = memo(({ totalItems, onClose }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            exit={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 min-w-[300px]"
        >
            <div className="flex items-center justify-between">
                <span className="font-medium">{totalItems > 0 ? `${totalItems} items in cart` : 'No items in cart'}</span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => navigate('/cart')}
                        className="bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-50 transition-colors"
                    >
                        View Cart
                    </button>
                    <button 
                        onClick={onClose}
                        className="text-white hover:text-orange-200 transition-colors"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </motion.div>
    );
});

CartSnackbar.displayName = 'CartSnackbar';

CartSnackbar.propTypes = {
    totalItems: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired
};

export default CartSnackbar;
