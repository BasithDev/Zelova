import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { BsCashCoin } from 'react-icons/bs';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { SiZcash } from 'react-icons/si';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {placeOrder} from '../../Services/apiServices';

const PaymentConfirmation = ({ 
    isOpen, 
    onClose, 
    items, 
    totalAmount, 
    tax, 
    platformFee, 
    appliedCoupon, 
    totalSavings, 
    isFreeDelivery, 
    deliveryFee, 
    offerSavings,
    selectedAddress,
    selectedPhoneNumber,
    restaurantId,
    cartId
}) => {
    const [selectedPayment, setSelectedPayment] = useState('COD');
    const finalTotal = totalAmount + tax + platformFee - (appliedCoupon?.discountAmount || 0);
    
    // Get user name from Redux store
    const userData = useSelector((state) => state.userData.data);

    const paymentOptions = [
        {
            id: 'COD',
            name: 'Cash on Delivery',
            icon: <BsCashCoin className="text-xl" />,
            description: 'Pay with cash upon delivery'
        },
        {
            id: 'RAZORPAY',
            name: 'RazorPay',
            icon: <RiSecurePaymentLine className="text-xl" />,
            description: 'Pay securely online'
        },
        {
            id: 'ZCOINS',
            name: 'Zcoins',
            icon: <SiZcash className="text-xl" />,
            description: 'Pay with your Zcoins balance'
        }
    ];

    if (!isOpen) return null;


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-6xl p-6 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Confirm Order</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Amount and Order Summary */}
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-gray-600 mb-2">Total Amount to Pay</p>
                            <div className="text-5xl font-bold">
                                ₹{finalTotal.toFixed(2)}
                            </div>
                            {totalSavings > 0 && (
                                <p className="text-green-600 text-sm mt-2">
                                    You saved ₹{totalSavings.toFixed(2)} on this order!
                                </p>
                            )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-700 mb-3">Order Summary</h3>
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <div key={item._id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {item.item.name} x {item.quantity}
                                        </span>
                                        <span className="font-medium">₹{(item.itemPrice * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="border-t border-gray-200 my-2 pt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Platform Fee</span>
                                        <span className="font-medium">₹{platformFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium">₹{tax.toFixed(2)}</span>
                                    </div>
                                    {offerSavings > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Offer Discount</span>
                                            <span>-₹{offerSavings.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Coupon Discount ({appliedCoupon.code})</span>
                                            <span>-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600">Delivery Fee</span>
                                            {isFreeDelivery && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                    Free Delivery
                                                </span>
                                            )}
                                        </div>
                                        <span className="flex items-center gap-2">
                                            {isFreeDelivery ? (
                                                <>
                                                    <span className="text-gray-400 line-through">₹{deliveryFee}</span>
                                                    <span className="text-green-600">FREE</span>
                                                </>
                                            ) : (
                                                `₹${deliveryFee}`
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payment Method and Button */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-700 mb-3">Select Payment Method</h3>
                            <div className="space-y-2">
                                {paymentOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={() => setSelectedPayment(option.id)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                            selectedPayment === option.id
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-orange-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                                            {option.icon}
                                        </div>
                                        <div>
                                            <div className="font-medium">{option.name}</div>
                                            <div className="text-sm text-gray-500">{option.description}</div>
                                        </div>
                                        <div className="ml-auto">
                                            <div className={`w-4 h-4 rounded-full border-2 ${
                                                selectedPayment === option.id
                                                    ? 'border-orange-500 bg-orange-500'
                                                    : 'border-gray-300'
                                            }`}>
                                                {selectedPayment === option.id && (
                                                    <div className="w-full h-full rounded-full bg-white scale-[0.4]" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
                            onClick={() => {
                                if (selectedPayment === 'COD') {
                                    const orderDetails = {
                                        user: {
                                            name: userData?.fullname,
                                            phoneNumber: selectedPhoneNumber,
                                            address: selectedAddress
                                        },
                                        restaurantId: restaurantId._id,
                                        cartId: cartId,
                                        couponCode:appliedCoupon ? appliedCoupon.code : null,
                                        items: items.map(item => ({
                                            name: item.item.name,
                                            quantity: item.quantity,
                                            price: item.itemPrice,
                                            totalPrice: item.itemPrice * item.quantity,
                                            customizations: item.selectedCustomizations?.map(customization => ({
                                                fieldName: customization.fieldName,
                                                selectedOption: customization.options
                                            })) || []
                                        })),
                                        billDetails: {
                                            itemTotal: totalAmount,
                                            platformFee,
                                            deliveryFee: isFreeDelivery ? 0 : deliveryFee,
                                            tax,
                                            discount: appliedCoupon ? appliedCoupon.discountAmount : 0,
                                            offerSavings,
                                            totalSavings,
                                            finalAmount: finalTotal,
                                            paymentMethod: 'COD'
                                        }
                                    };
                                    placeOrder(orderDetails);
                                    onClose();
                                }
                            }}
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

PaymentConfirmation.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        item: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
        quantity: PropTypes.number.isRequired,
        itemPrice: PropTypes.number.isRequired,
    })).isRequired,
    totalAmount: PropTypes.number.isRequired,
    tax: PropTypes.number.isRequired,
    platformFee: PropTypes.number.isRequired,
    appliedCoupon: PropTypes.shape({
        code: PropTypes.string.isRequired,
        discountAmount: PropTypes.number.isRequired,
    }),
    totalSavings: PropTypes.number.isRequired,
    isFreeDelivery: PropTypes.bool.isRequired,
    deliveryFee: PropTypes.number.isRequired,
    offerSavings: PropTypes.number.isRequired,
    selectedAddress: PropTypes.string.isRequired,
    selectedPhoneNumber: PropTypes.string.isRequired,
    restaurantId: PropTypes.object.isRequired,
    cartId: PropTypes.string.isRequired,
};

export default PaymentConfirmation;
