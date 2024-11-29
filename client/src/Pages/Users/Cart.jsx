import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaMinus, FaPlus, FaChevronDown } from 'react-icons/fa';
import { useCart } from '../../Hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, updateCartMutation } = useCart();
    const cartData = cart?.data?.cart;
    const restaurant = cart?.data?.cart?.restaurantId;

    const coupons = [
        {
            _id: "coup1",
            code: "WELCOME50",
            title: "50% Off For New Users",
            description: "Get 50% off up to ₹100 on your first order",
            maxDiscount: 100,
            minOrderValue: 200
        },
        {
            _id: "coup2",
            code: "FREEDEL",
            title: "Free Delivery",
            description: "No delivery charges on orders above ₹300",
            maxDiscount: 40,
            minOrderValue: 300
        },
        {
            _id: "coup3",
            code: "SPECIAL20",
            title: "Special Discount",
            description: "Get flat ₹100 off on orders above ₹500",
            maxDiscount: 100,
            minOrderValue: 500
        }
    ];

    const [showCoupons, setShowCoupons] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [showAddresses, setShowAddresses] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('123 Main St, Apartment 4B, New York, NY 10001');
    const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');

    const savedAddresses = [
        {
            _id: '1',
            label: 'Home',
            address: '123 Main St, Apartment 4B, New York, NY 10001',
            phone: '+1 (555) 123-4567'
        },
        {
            _id: '2',
            label: 'Work',
            address: '456 Business Ave, Suite 200, New York, NY 10002',
            phone: '+1 (555) 987-6543'
        },
        {
            _id: '3',
            label: 'Parents',
            address: '789 Family Lane, House 12, New York, NY 10003',
            phone: '+1 (555) 246-8135'
        }
    ];

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        console.log('Copied code:', code);
    };

    const handleApplyCoupon = () => {
        console.log('Applying coupon:', couponCode);
    };

    const calculateItemPrice = (cartItem) => {
        const originalPrice = cartItem.itemPrice * cartItem.quantity;
        const offer = cartItem.item.offers;
        
        if (offer && cartItem.quantity >= offer.requiredQuantity) {
            const discount = (originalPrice * offer.discountAmount) / 100;
            return {
                original: originalPrice,
                discounted: originalPrice - discount,
                hasDiscount: true
            };
        }
        return {
            original: originalPrice,
            discounted: originalPrice,
            hasDiscount: false
        };
    };

    const calculateItemTotal = () => {
        if (!cartData?.items) return 0;
        
        return cartData.items.reduce((total, cartItem) => {
            const price = calculateItemPrice(cartItem);
            return total + price.discounted;
        }, 0);
    };

    const totalPrice = calculateItemTotal();
    const originalPrice = cartData?.items?.reduce((total, item) => total + (item.itemPrice * item.quantity), 0) || 0;
    const totalSavings = originalPrice - totalPrice;
    const tax = totalPrice * 0.05; // 5% tax
    const deliveryFee = totalPrice >= 500 ? 0 : 40;
    const platformFee = 8;
    const totalAmount = totalPrice + tax + deliveryFee + platformFee;

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
        setDeliveryAddress(address.address);
        setPhoneNumber(address.phone);
        setSelectedAddress(address._id);
        setShowAddresses(false);
    };

    if (!cartData || !cartData.items || cartData.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
                <p className="text-gray-500">Add some delicious items to your cart!</p>
                <motion.button
                    className="bg-orange-500 mt-2 text-white px-4 py-2 rounded-md font-bold transition duration-300 hover:bg-yellow-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    Shop Now
                </motion.button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className='text-4xl font-bold text-gray-800 mb-6 text-center'>Checkout</h1>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="h-32 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 relative">
                    <div className="absolute inset-0">
                        <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="url(#pattern)" />
                            <defs>
                                <pattern id="pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <circle cx="5" cy="5" r="2" fill="currentColor" />
                                </pattern>
                            </defs>
                        </svg>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/30"></div>
                </div>
                <div className="p-6 relative">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-lg overflow-hidden shadow-lg -mt-12 border-4 border-white bg-white">
                            <img 
                                src={restaurant?.image} 
                                alt={restaurant?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{restaurant?.name}</h1>
                                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                                        <FaMapMarkerAlt className="text-orange-500" />
                                        {restaurant?.address}
                                    </p>
                                </div>
                                <div className="bg-green-100 px-3 py-1 rounded-lg">
                                    <span className="text-green-700 font-medium">Open</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                <span className="bg-orange-50 text-orange-600 text-sm px-3 py-1 rounded-full">Fast Food</span>
                                <span className="bg-orange-50 text-orange-600 text-sm px-3 py-1 rounded-full">Burgers</span>
                                <span className="bg-orange-50 text-orange-600 text-sm px-3 py-1 rounded-full">Beverages</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
                            <div className="flex flex-col">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-2xl">{cartItem.item.name}</h3>
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
                                            <div className='bg-green-200 text-green-500 font-semibold text-md py-1 px-2 rounded-md mt-2 w-fit'>
                                                <p>{cartItem.item.offers.offerName}</p>
                                            </div>
                                            
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <motion.div 
                                            className="flex items-center bg-orange-50 rounded-lg overflow-hidden"
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
                                            <div className="text-sm text-gray-500">
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
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter coupon code"
                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                        />
                        <button
                            onClick={handleApplyCoupon}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                    
                    <div className="relative">
                        <button
                            onClick={() => setShowCoupons(!showCoupons)}
                            className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center"
                        >
                            View Available Coupons
                            <FaChevronDown 
                                className={`ms-1 transform transition-transform ${showCoupons ? 'rotate-180' : ''}`}
                                size={12}
                            />
                        </button>
                    </div>
                </div>
                
                {showCoupons && (
                    <div className="border-t border-gray-100 pt-4 px-4">
                        <div className="space-y-3 hide-scrollbar max-h-56 overflow-y-auto">
                            {coupons.map(coupon => (
                                <div 
                                    key={coupon._id} 
                                    className="border border-gray-100 rounded-lg p-3 hover:border-orange-500 transition-colors bg-gray-50"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 mr-4">
                                            <h3 className="font-medium text-gray-800">{coupon.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">Min. Order: ₹{coupon.minOrderValue}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium whitespace-nowrap">
                                                {coupon.code}
                                            </span>
                                            <button
                                                onClick={() => handleCopyCode(coupon.code)}
                                                className="bg-orange-500 text-white py-1 px-2 rounded-md hover:text-orange-600 text-sm font-medium"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 my-6">
                <div className="mb-1">
                    <h2 className="text-xl font-bold mb-4">Confirm Delivery Details</h2>
                    <div className="space-y-3 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                            <textarea
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 resize-none"
                                rows="2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowAddresses(!showAddresses)}
                            className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center"
                        >
                            View Saved Addresses
                            <FaChevronDown 
                                className={`ms-1 transform transition-transform ${showAddresses ? 'rotate-180' : ''}`}
                                size={12}
                            />
                        </button>
                    </div>
                </div>

                {showAddresses && (
                    <div className="border-t border-gray-100 pt-4 px-4">
                        <div className="space-y-3 hide-scrollbar max-h-56 overflow-y-auto">
                            {savedAddresses.map(addr => (
                                <div 
                                    key={addr._id} 
                                    className={`border rounded-lg p-3 transition-colors ${
                                        selectedAddress === addr._id 
                                        ? 'border-orange-500 bg-orange-50' 
                                        : 'border-gray-100 bg-gray-50 hover:border-orange-500'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 mr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-sm font-medium">
                                                    {addr.label}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {addr.phone}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{addr.address}</p>
                                        </div>
                                        <button
                                            onClick={() => handleSelectAddress(addr)}
                                            className={`px-4 py-1 rounded-md text-sm font-medium ${
                                                selectedAddress === addr._id
                                                ? 'bg-orange-500 text-white'
                                                : 'text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white'
                                            }`}
                                        >
                                            {selectedAddress === addr._id ? 'Selected' : 'Select'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
                                    <span className="text-gray-400 line-through">₹40</span>
                                    <span className="text-green-600">FREE</span>
                                </>
                            ) : (
                                "₹40"
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
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="mt-2 space-y-1">
                            {totalSavings > 0 && (
                                <div className="text-green-600 text-sm">
                                    You saved ₹{totalSavings.toFixed(2)} with offers
                                </div>
                            )}
                            {totalPrice >= 500 && (
                                <div className="text-green-600 text-sm">
                                    You saved ₹40 on delivery charges
                                </div>
                            )}
                            {totalSavings > 0 || totalPrice >= 500 ? (
                                <div className="text-green-600 text-sm font-semibold">
                                    Total Savings: ₹{(totalSavings + (totalPrice >= 500 ? 40 : 0)).toFixed(2)}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                <motion.button 
                    className="w-full bg-orange-500 text-white rounded-lg py-3 mt-6 font-semibold hover:bg-orange-600 transition duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Confirm Order • ₹{totalAmount.toFixed(2)}
                </motion.button>
            </div>
        </div>
    );
};

export default Cart;