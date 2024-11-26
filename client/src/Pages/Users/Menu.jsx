import { useState, useEffect, useCallback } from "react";
import { FiMenu } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { getMenuForUser } from '../../Services/apiServices';
import { useDispatch, useSelector } from "react-redux";
import { RingLoader } from 'react-spinners';
import { calculateDistanceAndTime } from '../../utils/distanceUtils';
import SearchBarWithCart from "../../Components/SearchBarWithCart/SearchBarWithCart";
import RestaurantCard from "../../Components/RestaurantCard/RestaurantCard";
import CartSnackbar from "../../Components/Snackbar/CartSnackbar";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from 'react-toastify';
import CustomizationModal from "../../Components/CustomizationModal/CustomizationModal";
import { fetchCart, updateCartItem, removeCartItem } from "../../Redux/slices/user/cartSlice";

const Menu = () => {
    const dispatch = useDispatch();

    const { id } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFabOpen, setIsFabOpen] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const cart = useSelector((state) => state.cart);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);

    const userLocation = useSelector((state) => state.userLocation);
    const { lat, lng: lon } = userLocation.coordinates;

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (cart.items.length > 0) {
            setShowSnackbar(true);
        } else {
            setShowSnackbar(false);
        }
    }, [cart.items]);

    const getItemQuantity = (itemId) => {
        const cartItem = cart.items.find(item => item.itemId === itemId);
        return cartItem ? cartItem.quantity : 0;
    };

    const handleUpdateCart = useCallback((item, action) => {
        const currentCartItem = cart.items.find(i => i.itemId === item._id);
        let newQuantity = 0;

        if (action === "increment") {
            newQuantity = (currentCartItem?.quantity || 0) + 1;
        } else if (action === "decrement") {
            newQuantity = (currentCartItem?.quantity || 0) - 1;
        } else if (action === "add") {
            newQuantity = 1;
        }

        if (newQuantity <= 0) {
            dispatch(removeCartItem({ cartId: cart.cartId, itemId: item._id }));
            return;
        }

        if (item.customizable && action === "add" && (!currentCartItem || currentCartItem.customizations.length === 0)) {

            setSelectedItem(item);
            setIsCustomizationModalOpen(true);
            return;
        }

        if (!cart.restaurantId || cart.restaurantId === restaurant._id) {
            dispatch(updateCartItem({
                itemId: item._id,
                quantity: newQuantity,
                customizations: currentCartItem?.customizations || []
            }));
        } else {
            const confirmed = window.confirm(
                "Adding items from a different restaurant will clear your current cart. Do you want to proceed?"
            );
            if (confirmed) {
                dispatch(updateCartItem({ itemId: item._id, quantity: newQuantity, customizations: [] }));
            }
        }

        dispatch(fetchCart());
    }, [cart, restaurant, dispatch]);

    const handleCustomizationConfirm = useCallback((customizations) => {
        if (selectedItem) {
            dispatch(updateCartItem({ itemId: selectedItem._id, quantity: 1, customizations }));
        }
    }, [selectedItem, dispatch]);

    const handleCategoryClick = (category) => {
        const categoryElement = document.getElementById(category);
        if (categoryElement) {
            categoryElement.scrollIntoView({ behavior: 'smooth' });
            setIsFabOpen(false);
        }
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await getMenuForUser(id, lat, lon);
                if (response?.data) {
                    setRestaurant(response.data.restaurant);
                    setMenuItems(response.data.menu);
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load menu");
            } finally {
                setLoading(false);
            }
        };

        if (id && lat && lon) {
            fetchMenu();
        }
    }, [id, lat, lon]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <RingLoader color="#4F46E5" loading={loading} size={50} />
                <p className="mt-4 text-gray-600">Loading menu...</p>
            </div>
        );
    }

    const { distanceInKm, timeInMinutes } = restaurant ? calculateDistanceAndTime(restaurant.distance) : { distanceInKm: 0, timeInMinutes: 0 };

    const menuByCategory = menuItems.reduce((acc, item) => {
        const categoryName = item.foodCategory?.name || 'Other';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(item);
        return acc;
    }, {});

    const filteredMenu = Object.entries(menuByCategory).reduce((acc, [category, items]) => {
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredItems.length > 0) {
            acc[category] = filteredItems;
        }
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50">
            <SearchBarWithCart
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
            />

            {restaurant && (
                <div className="p-4">
                    <RestaurantCard
                        restaurant={restaurant}
                        distanceInKm={distanceInKm}
                        timeInMinutes={timeInMinutes}
                    />
                </div>
            )}

            <AnimatePresence>
                {showSnackbar && (
                    <CartSnackbar
                        totalItems={cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                        onClose={() => setShowSnackbar(false)}
                    />
                )}
            </AnimatePresence>

            <CustomizationModal
                isOpen={isCustomizationModalOpen}
                onClose={() => setIsCustomizationModalOpen(false)}
                item={selectedItem}
                onConfirm={handleCustomizationConfirm}
            />

            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsFabOpen(!isFabOpen)}
                    className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
                >
                    <FiMenu size={24} />
                </button>

                <AnimatePresence>
                    {isFabOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-48"
                        >
                            {Object.keys(filteredMenu).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className="block py-2 px-4 hover:bg-gray-100 rounded"
                                >
                                    {category}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="pb-20">
                {Object.entries(filteredMenu).map(([categoryName, items]) => (
                    <div key={categoryName} id={categoryName} className="px-8 py-4 mb-12">
                        <h3 className="text-3xl underline font-extrabold px-3 mb-6 text-gray-800">{categoryName}</h3>
                        {items.map((item) => {
                            const quantity = getItemQuantity(item._id);

                            return (
                                <div key={item._id} className="bg-white rounded-lg shadow-lg p-6 mb-6 flex justify-between items-start hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex-1">
                                        <h4 className="text-2xl font-semibold mb-3 text-gray-900">{item.name}</h4>
                                        <p className="text-gray-500 mb-3">{item.description}</p>
                                        <p className="text-xl font-bold text-green-600">₹{item.price}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        {item.image && (
                                            <div className="w-40 h-40">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-lg shadow-md"
                                                />
                                            </div>
                                        )}
                                        {quantity > 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex items-center gap-3 bg-white border-green-600 border-2 text-green-600 px-3 py-2 rounded-lg"
                                            >
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleUpdateCart(item, "decrement")}
                                                    className="text-2xl font-bold hover:text-green-400"
                                                >
                                                    -
                                                </motion.button>
                                                <motion.span
                                                    key={quantity}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="w-10 text-center text-2xl font-semibold"
                                                >
                                                    {quantity}
                                                </motion.span>
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleUpdateCart(item, "increment")}
                                                    className="text-2xl font-bold hover:text-green-400"
                                                >
                                                    +
                                                </motion.button>
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleUpdateCart(item, "add")}
                                                className="bg-green-600 text-white text-2xl px-8 font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Add
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;