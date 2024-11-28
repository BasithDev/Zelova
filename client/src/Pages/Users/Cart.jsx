import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaMinus, FaPlus } from 'react-icons/fa';

const Cart = () => {
    // Mock data for demonstration
    const restaurant = {
        name: "KFC",
        image: "https://example.com/kfc-image.jpg",
        location: "123 Main St, City"
    };

    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Chicken Burger",
            price: 150,
            quantity: 2,
            offer: {
                type: "quantity",
                threshold: 2,
                discount: 10,
                description: "Buy 2 Get 10% off"
            },
            isCustomizable: true,
            selectedCustomizations: ["Extra cheese", "Spicy mayo"],
            customOptions: [
                { id: 1, name: "Extra cheese", price: 30 },
                { id: 2, name: "Spicy mayo", price: 20 },
                { id: 3, name: "No onions", price: 0 },
                { id: 4, name: "Extra patty", price: 80 }
            ]
        },
        {
            id: 2,
            name: "French Fries",
            price: 100,
            quantity: 1,
            offer: {
                type: "combo",
                description: "Add drink for ₹50 only"
            },
            isCustomizable: true,
            selectedCustomizations: ["Extra masala"],
            customOptions: [
                { id: 1, name: "Extra masala", price: 10 },
                { id: 2, name: "Cheese sauce", price: 40 }
            ]
        }
    ]);


    const handleQuantity = (id, increment) => {
        setCartItems(items => {
            const updatedItems = items.map(item => {
                if (item.id === id) {
                    const newQuantity = item.quantity + (increment ? 1 : -1);
                    if (newQuantity === 0) return null;
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
            return updatedItems.filter(Boolean);
        });
    };

    const calculateItemTotal = (item) => {
        const basePrice = item.price;
        const customizationPrice = item.selectedCustomizations.reduce((total, customName) => {
            const option = item.customOptions.find(opt => opt.name === customName);
            return total + (option?.price || 0);
        }, 0);
        
        const subtotal = (basePrice + customizationPrice) * item.quantity;
        
        // Apply offer if applicable
        if (item.offer?.type === "quantity" && item.quantity >= item.offer.threshold) {
            return subtotal * (1 - item.offer.discount / 100);
        }
        return subtotal;
    };

    const calculateSavings = () => {
        let totalSavings = 0;
        cartItems.forEach(item => {
            const basePrice = item.price;
            const customizationPrice = item.selectedCustomizations.reduce((total, customName) => {
                const option = item.customOptions.find(opt => opt.name === customName);
                return total + (option?.price || 0);
            }, 0);
            
            const subtotal = (basePrice + customizationPrice) * item.quantity;
            
            if (item.offer?.type === "quantity" && item.quantity >= item.offer.threshold) {
                const discountAmount = subtotal * (item.offer.discount / 100);
                totalSavings += discountAmount;
            }
        });
        return totalSavings;
    };

    const subtotal = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const tax = subtotal * 0.05; // 5% tax
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const platformFee = 20;
    const totalAmount = subtotal + tax + deliveryFee + platformFee;
    const totalSavings = calculateSavings();

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Restaurant Details */}
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
                                src={restaurant.image} 
                                alt={restaurant.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{restaurant.name}</h1>
                                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                                        <FaMapMarkerAlt className="text-orange-500" />
                                        {restaurant.location}
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

            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Your Order</h2>
                <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                        <motion.li 
                            key={item.id}
                            className="py-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                                        {item.offer && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                                    {item.offer.description}
                                                </span>
                                            </div>
                                        )}
                                        <div className="mt-1 space-y-1">
                                            {item.selectedCustomizations.length > 0 && (
                                                <div className="text-sm text-gray-600">
                                                    Add-Ons Added: {item.selectedCustomizations.join(", ")}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <motion.div 
                                            className="flex items-center bg-orange-50 rounded-lg overflow-hidden"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <motion.button 
                                                onClick={() => handleQuantity(item.id, false)}
                                                className="px-3 py-2 hover:bg-orange-100 transition-colors"
                                                whileHover={{ backgroundColor: 'rgb(251 146 60 / 0.2)' }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FaMinus className="text-orange-500" size={12} />
                                            </motion.button>
                                            <motion.div 
                                                className="w-10 flex items-center justify-center font-semibold text-gray-700"
                                                key={item.quantity}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                {item.quantity}
                                            </motion.div>
                                            <motion.button 
                                                onClick={() => handleQuantity(item.id, true)}
                                                className="px-3 py-2 hover:bg-orange-100 transition-colors"
                                                whileHover={{ backgroundColor: 'rgb(251 146 60 / 0.2)' }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FaPlus className="text-orange-500" size={12} />
                                            </motion.button>
                                        </motion.div>
                                        <motion.div 
                                            className="text-right"
                                            key={calculateItemTotal(item)}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="font-bold text-gray-800">
                                                ₹{calculateItemTotal(item).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ₹{(item.price + item.selectedCustomizations.reduce((total, customName) => {
                                                    const option = item.customOptions.find(opt => opt.name === customName);
                                                    return total + (option?.price || 0);
                                                }, 0))} each
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Bill Details</h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Item Total</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>GST (5%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <div className="flex items-center gap-2">
                            <span>Delivery Fee</span>
                            {subtotal >= 500 && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    Free Delivery
                                </span>
                            )}
                        </div>
                        <span className="flex items-center gap-2">
                            {subtotal >= 500 ? (
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
                    {subtotal < 500 && (
                        <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                            Add items worth ₹{(500 - subtotal).toFixed(2)} more for free delivery
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
                            {subtotal >= 500 && (
                                <div className="text-green-600 text-sm">
                                    You saved ₹40 on delivery charges
                                </div>
                            )}
                            {totalSavings > 0 || subtotal >= 500 ? (
                                <div className="text-green-600 text-sm font-semibold">
                                    Total Savings: ₹{(totalSavings + (subtotal >= 500 ? 40 : 0)).toFixed(2)}
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