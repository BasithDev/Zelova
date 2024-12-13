import { motion } from 'framer-motion';
import { FaMinus, FaPlus, FaChevronDown, FaMapMarkerAlt } from 'react-icons/fa';
import { useCart } from '../../Hooks/useCart';
import { useNavigate} from 'react-router-dom';
import { useState, useEffect,useCallback,useRef } from 'react';
import { useSelector } from 'react-redux';
import { getAddresses , getUserCoupons , getDeliveryFee } from '../../Services/apiServices';
import { AnimatePresence } from 'framer-motion';
import { calculateItemPrice, calculateItemTotal } from '../../utils/cartCalculations';
import { useCartState } from '../../Hooks/useCartState';
import RestaurantHeader from '../../components/Restaurant/RestaurantHeader';
import PaymentConfirmation from '../../components/Cart/PaymentConfirmation';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, updateCartMutation } = useCart();
    const userPhoneNumber = useSelector((state) => state?.userData?.data?.phoneNumber);
    const userAddress = useSelector((state) => state?.userLocation?.address);
    const [savedAddresses, setSavedAddresses] = useState({ addresses: [] });
    const [selectedAddress, setSelectedAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const cartData = cart?.data?.cart;
    const restaurant = cart?.data?.cart?.restaurantId;

    const [cartState, updateCartState] = useCartState(userAddress, userPhoneNumber);
    const {
        coupons, showCoupons, couponCode, appliedCoupon, couponError,
        showAddresses, 
        deliveryAddress,
        isUsingCurrentLocation
    } = cartState;

    const [deliveryFee, setDeliveryFee] = useState(10);
    const userLocation = useSelector((state) => state?.userLocation);
    const restaurantId = cart?.data?.cart?.restaurantId?._id;

    const initialFetch = useRef(true);


    const fetchData = useCallback(async () => {
        try {
            const [addressesResponse, couponsResponse, deliveryFeeResponse] = await Promise.all([
                getAddresses(),
                getUserCoupons(),
                userLocation?.coordinates && restaurantId ? getDeliveryFee(userLocation?.coordinates?.lat, userLocation?.coordinates?.lng, restaurantId) : Promise.resolve({ data: { deliveryFee: 10 } })
            ]);

            setSavedAddresses(addressesResponse?.data || []);
            updateCartState({ coupons: couponsResponse?.data || [] });

            if (deliveryFeeResponse && deliveryFeeResponse.data) {
                setDeliveryFee(deliveryFeeResponse.data.deliveryFee);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [updateCartState, userLocation, restaurantId]);

    useEffect(() => {
        if (initialFetch.current && userLocation?.coordinates && restaurantId) {
            fetchData();
            initialFetch.current = false; // Prevent further calls
        }
    }, [fetchData, userLocation?.coordinates, restaurantId]);

    const totalPrice = calculateItemTotal(cartData);
    const originalPrice = cartData?.items?.reduce((total, item) => total + (item.itemPrice * item.quantity), 0) || 0;
    const totalSavings = originalPrice - totalPrice;
    const tax = totalPrice * 0.05; // 5% tax
    const platformFee = 8;

    const handleQuantity = (itemId, action) => {
        const cartItem = cartData?.items?.find(
            (item) => item.item._id === itemId
        );

        const payload = {
            itemId,
            action,
            selectedCustomizations: cartItem?.selectedCustomizations || null
        };
    
        updateCartMutation.mutate(payload);
    };

    const handleSelectAddress = (address) => {
        setSelectedAddress(address._id);
        updateCartState({
            isUsingCurrentLocation: false,
            deliveryAddress: address.address,
            showAddresses: false
        });
    };

    const handleUseCurrentLocation = () => {
        updateCartState({
            isUsingCurrentLocation: true,
            selectedAddress: '',
            deliveryAddress: userAddress,
            showAddresses: false
        });
    };

    const handleUseRegisteredPhone = () => {
        setPhoneNumber(userPhoneNumber);
        updateCartState({
            showAddresses: false
        });
    };

    const handleUseCoupon = (code) => {
        updateCartState({
            couponCode: code,
            showCoupons: false
        });
    };

    const handleApplyCoupon = () => {
        updateCartState({ couponError: '' });
        const coupon = coupons.find(c => c.code === couponCode);
        
        if (!coupon) {
            updateCartState({ couponError: 'Invalid coupon code' });
            return;
        }

        if (totalPrice < coupon.minPrice) {
            updateCartState({
                couponError: `Add items worth ₹${(coupon.minPrice - totalPrice).toFixed(2)} more to apply this coupon`
            });
            return;
        }

        const discountAmount = coupon.type === 'percentage' 
            ? (totalPrice * coupon.discount) / 100 
            : coupon.discount;

        updateCartState({
            appliedCoupon: {
                ...coupon,
                discountAmount
            }
        });
    };

    const removeCoupon = () => {
        updateCartState({
            appliedCoupon: null,
            couponError: ''
        });
    };

    const [showPaymentPopup, setShowPaymentPopup] = useState(false);

    const handleConfirmOrder = () => {
        setShowPaymentPopup(true);
    };

    if (!cartData || !cartData.items || cartData.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <img
                    src="/empty-cart.svg"
                    alt="Empty Cart"
                    className="w-64 h-64 mb-4"
                    onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='9' cy='21' r='1'%3E%3C/circle%3E%3Ccircle cx='20' cy='21' r='1'%3E%3C/circle%3E%3Cpath d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'%3E%3C/path%3E%3C/svg%3E";
                    }}
                />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-4">Add some delicious items to your cart!</p>
                <button onClick={() => navigate('/')} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                    Browse Menu
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className='text-4xl font-bold text-gray-800 mb-6 text-center'>Checkout</h1>
            <RestaurantHeader restaurant={restaurant} />

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Your Cart</h2>
                <ul className="divide-y divide-gray-200">
                    {cartData.items.map((cartItem) => (
                        <motion.li 
                            key={cartItem._id}
                            className="py-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex flex-col space-y-3">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-lg sm:text-2xl">{cartItem.item.name}</h3>
                                        {cartItem.selectedCustomizations && cartItem.selectedCustomizations.length > 0 && (
                                            <div className="mt-1 space-y-1">
                                                <div className="text-sm text-gray-600">
                                                    {cartItem.selectedCustomizations.map(customization => (
                                                        <div key={customization._id}>
                                                           Add-Ons : {customization.fieldName}: {customization.options.name} - ₹{customization.options.price}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {cartItem.item.offers && (
                                            <div className='bg-green-200 text-green-500 font-semibold text-sm sm:text-md py-1 px-2 rounded-md mt-2 w-fit'>
                                                <p>{cartItem.item.offers.offerName}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex justify-between sm:flex-col sm:items-end gap-4">
                                        <motion.div 
                                            className="flex items-center bg-orange-50 rounded-lg overflow-hidden h-fit"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <motion.button 
                                                onClick={() => handleQuantity(cartItem.item._id, 'remove')}
                                                className="px-3 py-2 hover:bg-orange-100 transition-colors"
                                                whileHover={{ backgroundColor: 'rgb(251 146 60 / 0.2)' }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FaMinus className="text-orange-500" size={12} />
                                            </motion.button>
                                            <motion.div 
                                                className="w-10 flex items-center justify-center font-semibold text-gray-700"
                                                key={cartItem.quantity}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                {cartItem.quantity}
                                            </motion.div>
                                            <motion.button 
                                                onClick={() => handleQuantity(cartItem.item._id, 'add')}
                                                className="px-3 py-2 hover:bg-orange-100 transition-colors"
                                                whileHover={{ backgroundColor: 'rgb(251 146 60 / 0.2)' }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FaPlus className="text-orange-500" size={12} />
                                            </motion.button>
                                        </motion.div>
                                        <motion.div 
                                            className="text-right"
                                            key={cartItem.itemPrice}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="font-bold text-gray-800">
                                                {(() => {
                                                    const price = calculateItemPrice(cartItem);
                                                    return price.hasDiscount ? (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-gray-400 line-through text-sm">
                                                                ₹{price.original}
                                                            </span>
                                                            <span className="text-green-600">
                                                                ₹{price.discounted.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span>₹{price.original}</span>
                                                    );
                                                })()}
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-500">
                                                ₹{cartItem.item.price} each
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 my-6">
                <div className="mb-1"> 
                    <h2 className="text-xl font-bold mb-4">Have a Coupon?</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => updateCartState({ couponCode: e.target.value.toUpperCase() })}
                            placeholder="Enter coupon code"
                            disabled={appliedCoupon !== null}
                            className={`flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none ${
                                appliedCoupon ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'focus:border-orange-500'
                            }`}
                        />
                        {appliedCoupon ? (
                            <button
                                onClick={removeCoupon}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Remove
                            </button>
                        ) : (
                            <button
                                onClick={handleApplyCoupon}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Apply
                            </button>
                        )}
                    </div>
                    
                    {couponError && (
                        <p className="text-red-500 text-sm mb-2">{couponError}</p>
                    )}
                    
                    <div className="relative">
                        <button
                            onClick={() => updateCartState({ showCoupons: !showCoupons })}
                            className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center"
                        >
                            View Available Coupons
                            <FaChevronDown 
                                className={`ms-1 transform transition-transform duration-300 ${showCoupons ? 'rotate-180' : ''}`}
                                size={12}
                            />
                        </button>
                    </div>
                </div>
                
                <AnimatePresence>
                    {showCoupons && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type:"tween",duration: 0. }}
                            className="overflow-hidden border-t border-gray-100 pt-4 px-4"
                        >
                            <div className="space-y-3 hide-scrollbar max-h-56 overflow-y-auto">
                                {coupons && coupons.map(coupon => (
                                    <div 
                                        key={coupon._id} 
                                        className="border border-gray-100 rounded-lg p-3 hover:border-orange-500 transition-colors bg-gray-50"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 mr-4">
                                                <h3 className="font-medium text-gray-800">{coupon.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                                                <p className="text-xs text-gray-500 mt-1">Min. Order: ₹{coupon.minPrice}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium whitespace-nowrap">
                                                    {coupon.code}
                                                </span>
                                                <button
                                                    onClick={() => handleUseCoupon(coupon.code)}
                                                    disabled={appliedCoupon?.code === coupon.code}
                                                    className={`${
                                                        appliedCoupon?.code === coupon.code
                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                            : 'bg-orange-500 hover:bg-orange-600'
                                                    } text-white py-1 px-2 rounded-md transition-colors text-sm font-medium`}
                                                >
                                                    {appliedCoupon?.code === coupon.code ? 'Applied' : 'Use'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {coupons.length === 0 && (
                                    <p className="text-sm text-gray-600">No coupons available for you right now.</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4">
                    <div className="flex items-center">
                        <FaMapMarkerAlt className="text-orange-500 mr-2 text-lg sm:text-xl" />
                        <h2 className="text-base sm:text-lg font-semibold">Confirm Delivery Details</h2>
                    </div>
                    <motion.button
                        onClick={() => updateCartState({ showAddresses: !showAddresses })}
                        className="flex items-center text-orange-500 text-sm sm:text-base"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Change
                        <motion.div
                            animate={{ rotate: showAddresses ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FaChevronDown className="ml-1" />
                        </motion.div>
                    </motion.button>
                </div>

                <AnimatePresence>
                    {showAddresses && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3 sm:space-y-4 overflow-hidden"
                        >
                            <motion.div
                                className="grid grid-cols-1 gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                {/* Current Location Option */}
                                <motion.button
                                    onClick={handleUseCurrentLocation}
                                    className={`p-3 border rounded-lg cursor-pointer flex items-center transition-all duration-300 ${
                                        isUsingCurrentLocation ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                                    }`}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaMapMarkerAlt className="text-orange-500 mr-2 text-lg" />
                                    <div className="text-left flex-1">
                                        <p className="font-medium text-sm sm:text-base">Use Current Location</p>
                                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-1">{userAddress || 'No location available'}</p>
                                    </div>
                                </motion.button>

                                {/* Saved Addresses */}
                                {savedAddresses?.addresses?.map((address) => (
                                    <motion.div
                                        key={address._id}
                                        onClick={() => handleSelectAddress(address)}
                                        className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                                            selectedAddress === address._id ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                                        }`}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-gray-600 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">{address.address}</p>
                                                <p className="text-gray-600 text-xs sm:text-sm mt-1">{address.phone}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Add New Address Button */}
                                <motion.button
                                    onClick={() => navigate('/address-manage')}
                                    className="w-full py-2 sm:py-3 text-sm sm:text-base text-orange-500 border border-orange-500 rounded-lg transition-all duration-300 hover:bg-orange-50 hover:border-orange-300 hover:shadow-sm"
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Add New Address
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!showAddresses && (
                    <motion.div 
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div>
                            <p className="text-gray-600 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">{deliveryAddress || 'Please select a delivery address'}</p>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 mt-2">
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Enter phone number"
                                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:border-orange-500"
                                />
                                {userPhoneNumber && (
                                    <motion.button
                                        onClick={handleUseRegisteredPhone}
                                        className="sm:ml-2 bg-orange-500 text-sm sm:text-base text-white py-2 px-3 rounded-lg hover:bg-orange-600 transition-all duration-300"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Use registered
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Bill Details</h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Item Total</span>
                        <span>₹{originalPrice}</span>
                    </div>
                    {totalSavings > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Offer Discount</span>
                            <span>- ₹{totalSavings.toFixed(2)}</span>
                        </div>
                    )}
                    {appliedCoupon && (
                        <div className="flex justify-between text-green-600">
                            <span>Coupon Discount ({appliedCoupon.code})</span>
                            <span>- ₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                        <span>GST (5%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <div className="flex items-center gap-2">
                            <span>Delivery Fee</span>
                            {totalPrice >= 500 && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    Free Delivery
                                </span>
                            )}
                        </div>
                        <span className="flex items-center gap-2">
                            {totalPrice >= 500 ? (
                                <>
                                    <span className="text-gray-400 line-through">₹{deliveryFee.toFixed(2)}</span>
                                    <span className="text-green-600">FREE</span>
                                </>
                            ) : (
                                `₹${deliveryFee.toFixed(2)}`
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Platform Fee</span>
                        <span>₹{platformFee}</span>
                    </div>
                    {totalPrice < 500 && (
                        <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                            Add items worth ₹{(500 - totalPrice).toFixed(2)} more for free delivery
                        </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between font-bold text-gray-800 text-lg">
                            <span>To Pay</span>
                            <span>₹{(totalPrice - (appliedCoupon ? appliedCoupon.discountAmount : 0) + tax + (totalPrice >= 500 ? 0 : deliveryFee) + platformFee).toFixed(2)}</span>
                        </div>
                        <div className="mt-2 space-y-1">
                            {totalSavings > 0 && (
                                <div className="text-green-600 text-sm">
                                    You saved ₹{totalSavings.toFixed(2)} with offers
                                </div>
                            )}
                            {appliedCoupon && (
                                <div className="text-green-600 text-sm">
                                    You saved ₹{appliedCoupon.discountAmount.toFixed(2)} with coupon
                                </div>
                            )}
                            {totalPrice >= 500 && (
                                <div className="text-green-600 text-sm">
                                    You saved ₹{deliveryFee.toFixed(2)} on delivery charges
                                </div>
                            )}
                            {(totalSavings > 0 || appliedCoupon || totalPrice >= 500) && (
                                <div className="text-green-600 text-sm font-semibold">
                                    Total Savings: ₹{(totalSavings + (appliedCoupon ? appliedCoupon.discountAmount : 0) + (totalPrice >= 500 ? deliveryFee : 0)).toFixed(2)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <motion.button 
                    className="w-full bg-orange-500 text-white rounded-lg py-3 mt-6 font-semibold hover:bg-orange-600 transition duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmOrder}
                >
                    Confirm Order • ₹{(totalPrice - (appliedCoupon ? appliedCoupon.discountAmount : 0) + tax + (totalPrice >= 500 ? 0 : deliveryFee) + platformFee).toFixed(2)}
                </motion.button>

                <AnimatePresence>
                    {showPaymentPopup && (
                        <PaymentConfirmation
                            isOpen={showPaymentPopup}
                            onClose={() => setShowPaymentPopup(false)}
                            items={cartData.items}
                            totalAmount={totalPrice}
                            tax={tax}
                            platformFee={platformFee}
                            appliedCoupon={appliedCoupon}
                            totalSavings={totalSavings + (appliedCoupon ? appliedCoupon.discountAmount : 0) + (totalPrice >= 500 ? deliveryFee : 0)}
                            isFreeDelivery={totalPrice >= 500}
                            deliveryFee={deliveryFee}
                            offerSavings={totalSavings}
                            selectedAddress={selectedAddress || userAddress}
                            selectedPhoneNumber={phoneNumber || userPhoneNumber}
                            restaurantId={restaurant}
                            cartId={cart.data.cart._id}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Cart;