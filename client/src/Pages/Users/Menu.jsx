import { useState, useEffect, useMemo } from "react";
import { FiMenu } from 'react-icons/fi';
import { FaPlus, FaMinus } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { getMenuForUser } from '../../Services/apiServices';
import { useSelector, useDispatch } from "react-redux";
import { calculateDistanceAndTime } from '../../utils/distanceUtils';
import RestaurantCard from "../../Components/RestaurantCard/RestaurantCard";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from 'react-toastify';
import Header from "../../Components/Common/Header";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import MenuSearch from "../../Components/MenuSearch/MenuSearch";
import CategoryMenu from "../../Components/CategoryMenu/CategoryMenu";
import { useCart } from "../../Hooks/useCart";
import { addFavorite, removeFavorite, getFavourites } from "../../Services/apiServices";

const Menu = () => {

    const {
        cart,
        updateCartMutation,
    } = useCart();

    const dispatch = useDispatch();
    const userCoordinates = useSelector((state) => state.userLocation.coordinates);

    const handleCartUpdation = (itemId, action, customizations = null) => {
        const payload = {
            itemId,
            action,
            selectedCustomizations: customizations
        };
    
        updateCartMutation.mutate(payload);
    };

    const { id } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [menuSearchQuery, setMenuSearchQuery] = useState("");
    const [debouncedMenuSearch, setDebouncedMenuSearch] = useState("");
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFabOpen, setIsFabOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('none');
    const [favorites, setFavorites] = useState(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomizations, setSelectedCustomizations] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);

    const handleModalOpen = (item) => {
        setSelectedItem(item);
        // Set default selections for each customization
        const defaultSelections = {};
        item.customizations.forEach(customization => {
            // Select the first option as default for each customization
            defaultSelections[customization.fieldName] = customization.options[0];
        });
        setSelectedCustomizations(defaultSelections);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setSelectedCustomizations({});
    };

    const handleCustomizationChange = (fieldName, option) => {
        setSelectedCustomizations(prev => ({
            ...prev,
            [fieldName]: option
        }));
    };

    const handleOkClick = (e) => {
        e.preventDefault();
        if (!selectedItem) return;
        const formattedCustomizations = Object.entries(selectedCustomizations).map(([fieldName, option]) => ({
            fieldName,
            options: option
        }));
        handleCartUpdation(selectedItem._id, 'add', formattedCustomizations);
        closeModal();
    };

    const handleCustomizableItemUpdate = (item, action) => {
        const cartItem = cart.data?.cart?.items?.find(
            (cartItem) => cartItem?.item._id === item._id
        );

        if (action === 'add') {
            if (!cartItem) {
                handleModalOpen(item);
            } else {
                // For existing items, use their current customizations
                handleCartUpdation(item._id, 'add', cartItem.selectedCustomizations);
            }
        } else if (action === 'remove') {
            handleCartUpdation(item._id, 'remove');
        }
    };

    const userLocation = useSelector((state) => state.userLocation);
    const { lat, lng: lon } = userLocation.coordinates;

    const debouncedSetMenuSearch = useMemo(
        () => debounce((value) => {
            setDebouncedMenuSearch(value);
        }, 300),
        []
    );

    useEffect(() => {
        return () => {
            debouncedSetMenuSearch.cancel();
        };
    }, [debouncedSetMenuSearch]);

    const handleMenuSearchChange = (e) => {
        const value = e.target.value;
        setMenuSearchQuery(value);
        debouncedSetMenuSearch(value);
    };

    const handleCategoryClick = (category) => {
        const categoryElement = document.getElementById(category);
        if (categoryElement) {
            categoryElement.scrollIntoView({ behavior: 'smooth' });
            setIsFabOpen(false);
        }
    };

    const toggleFavorite = async (itemId) => {
        try {
            if (favorites.has(itemId)) {
                await removeFavorite({ foodItemId: itemId });
                setFavorites((prev) => {
                    const newFavorites = new Set(prev);
                    newFavorites.delete(itemId);
                    return newFavorites;
                });
                toast.success("Item removed from favorites!");
            } else {
                await addFavorite({ foodItemId: itemId });
                setFavorites((prev) => new Set(prev).add(itemId));
                toast.success("Item added to favorites!");
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            toast.error("Failed to toggle favorite. Please try again.");
        }
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const response = await getMenuForUser(id, lat, lon);

                if (response?.data) {
                    setRestaurant(response.data.restaurant);
                    setMenuItems(response.data.menu);
                } else {
                    toast.error("No menu data found");
                }

                setLoading(false);
            } catch (error) {
                console.log(error);
                toast.error("Failed to load menu");
                setLoading(false);
            }
        };

        const fetchFavourites = async () => {
            try {
                const response = await getFavourites();
                if (response?.data) {
                    const favoriteIds = response.data.favorites.map((favorite) => favorite.item);
                    setFavorites(new Set(favoriteIds));
                }
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };

        if (id && lat && lon) {
            fetchMenu();
            fetchFavourites();
        } else {
            toast.error("Invalid restaurant or location details");
            setLoading(false);
        }
    }, [id, lat, lon, dispatch, userCoordinates]);

    if (loading) {
        return <LoadingSpinner message="Loading menu..." />;
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

    const sortItems = (items) => {
        if (sortOrder === 'none') return items;
        return [...items].sort((a, b) => {
            if (sortOrder === 'lowToHigh') return a.price - b.price;
            if (sortOrder === 'highToLow') return b.price - a.price;
            return 0;
        });
    };

    const filteredMenu = Object.entries(menuByCategory).reduce((acc, [category, items]) => {
        const query = debouncedMenuSearch.toLowerCase().trim();
        let filteredItems = items;

        if (query) {
            filteredItems = items.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                category.toLowerCase().includes(query)
            );
        }

        if (filteredItems.length > 0) {
            acc[category] = sortItems(filteredItems);
        }
        return acc;
    }, {});

    const hasResults = Object.keys(filteredMenu).length > 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                placeholderText="Search foods, restaurants, etc..."
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

            {/* Menu Search and Sort Section */}
            <MenuSearch
                menuSearchQuery={menuSearchQuery}
                onSearchChange={handleMenuSearchChange}
                sortOrder={sortOrder}
                onSortChange={(e) => setSortOrder(e.target.value)}
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
                        <CategoryMenu
                            isOpen={isFabOpen}
                            onToggle={() => setIsFabOpen(!isFabOpen)}
                            categories={Object.keys(menuByCategory)}
                            onCategoryClick={handleCategoryClick}
                        />
                    )}
                </AnimatePresence>
            </div>

            <div className="pb-20">
                {!hasResults && debouncedMenuSearch && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-xl text-gray-600">{`No menu items found matching - "${debouncedMenuSearch}"`}</p>
                        <p className="text-gray-500 mt-2">Try a different search term</p>
                    </div>
                )}

                {Object.entries(filteredMenu).map(([categoryName, items]) => (
                    <div key={categoryName} id={categoryName} className="px-8 py-3">
                        <h3 className="text-3xl font-extrabold px-3 mb-6 text-gray-800">{categoryName}</h3>

                        {items.map((item) => (
                            <div key={item._id} className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row justify-between items-start hover:shadow-xl transition-shadow duration-300">
                                <div className="flex-1 mb-4 md:mb-0">
                                    <h4 className="text-2xl font-semibold mb-3 text-gray-900">{item.name}</h4>
                                    <p className="text-gray-500 mb-3">{item.description}</p>
                                    <p className="text-xl font-bold text-green-600 mb-3">₹{item.price}</p>
                                    <p className={`text-lg font-semibold w-fit ${item?.offers?.offerName ? 'text-green-600 bg-green-200' : 'text-yellow-600 bg-yellow-200'} p-2 rounded-lg mb-3`}>{item.offers?.offerName || 'Buy For 500+ Get Free Delivery'}</p>
                                    <button
                                        onClick={() => toggleFavorite(item._id)}
                                        className="w-fit p-2 bg-gray-100 rounded-full transition-colors duration-300"
                                    >
                                        {favorites.has(item._id) ? (
                                            <FaHeart className="text-red-500 text-2xl" />
                                        ) : (
                                            <FaRegHeart className="text-gray-400 hover:text-red-500 text-2xl" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    {item.image && (
                                        <div className="w-40 h-40">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded-lg shadow-md"
                                            />
                                        </div>
                                    )}
                                    {item.customizable ? (
                                        cart.data?.cart?.items?.find(
                                            (cartItem) => cartItem?.item._id === item._id
                                        )?.quantity > 0 ? (
                                            <div className="flex bg-white rounded-lg shadow-md py-2 px-4 border-orange-500 border-2 items-center gap-6">
                                                <button
                                                    onClick={() => handleCustomizableItemUpdate(item, 'remove')}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 p-1 rounded-lg transition-colors duration-300"
                                                >
                                                    <FaMinus className="text-orange-500 text-xl" />
                                                </button>
                                                <p className="text-2xl text-orange-500 font-bold">{cart.data?.cart?.items?.find((cartItem) => cartItem?.item._id === item._id)?.quantity}</p>
                                                <button
                                                    onClick={() => handleCustomizableItemUpdate(item, 'add')}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 p-1 rounded-lg transition-colors duration-300"
                                                >
                                                    <FaPlus className="text-orange-500 text-xl" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleModalOpen(item)}
                                                className="w-full px-4 py-2 text-2xl bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300"
                                            >
                                                Add
                                            </button>
                                        )
                                    ) : (
                                        cart.data?.cart?.items?.find(
                                            (cartItem) => cartItem?.item._id === item._id
                                        )?.quantity > 0 ? (
                                            <div className="flex bg-white rounded-lg shadow-md py-2 px-4 border-orange-500 border-2 items-center gap-6">
                                                <button
                                                    onClick={() => handleCartUpdation(item._id, 'remove')}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 p-1 rounded-lg transition-colors duration-300"
                                                >
                                                    <FaMinus className="text-orange-500 text-xl" />
                                                </button>
                                                <p className="text-2xl text-orange-500 font-bold">{cart.data?.cart?.items?.find((cartItem) => cartItem?.item._id === item._id)?.quantity}</p>
                                                <button
                                                    onClick={() => handleCartUpdation(item._id, 'add')}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 p-1 rounded-lg transition-colors duration-300"
                                                >
                                                    <FaPlus className="text-orange-500 text-xl" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleCartUpdation(item._id, 'add')}
                                                className="w-full px-4 py-2 text-2xl bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300"
                                            >
                                                Add
                                            </button>
                                        )
                                    )}
                                    <AnimatePresence>
                                    {isModalOpen && selectedItem && (
                                            <motion.div 
                                                className="fixed inset-0 flex items-center justify-center"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <motion.div
                                                    className="bg-white rounded-xl p-8 w-[28rem] relative shadow-[0_0_12px_0_rgba(0,0,0,0.3)]"
                                                    initial={{ 
                                                        opacity: 0,
                                                        scale: 0.5,
                                                        y: 100
                                                    }}
                                                    animate={{ 
                                                        opacity: 1,
                                                        scale: 1,
                                                        y: 0,
                                                        transition: {
                                                            type: "spring",
                                                            stiffness: 300,
                                                            damping: 20
                                                        }
                                                    }}
                                                    exit={{ 
                                                        opacity: 0,
                                                        scale: 0.5,
                                                        y: 100,
                                                        transition: { 
                                                            duration: 0.1 
                                                        }
                                                    }}
                                                >
                                                    <h2 className="text-2xl font-bold mb-6">{selectedItem.name}</h2>
                                                    <form onSubmit={handleOkClick}>
                                                        {selectedItem.customizations.map((customization) => (
                                                            <div key={customization._id} className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-3">
                                                                    {customization.fieldName}
                                                                </label>
                                                                <div className="flex flex-wrap gap-3">
                                                                    {customization.options.map((option) => (
                                                                        <motion.button
                                                                            key={option._id}
                                                                            type="button"
                                                                            onClick={() => handleCustomizationChange(customization.fieldName, option)}
                                                                            className={`px-4 py-2.5 rounded-lg shadow-sm ${
                                                                                selectedCustomizations[customization.fieldName]?._id === option._id
                                                                                    ? 'bg-blue-500 text-white shadow-blue-200' 
                                                                                    : 'bg-white border border-gray-200 hover:border-blue-300'
                                                                            }`}
                                                                            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                                                                            whileTap={{ scale: 0.97 }}
                                                                        >
                                                                            {option.name} - ₹{option.price}
                                                                        </motion.button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="flex justify-end mt-8 gap-3">
                                                            <motion.button
                                                                type="button"
                                                                onClick={closeModal}
                                                                className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300"
                                                                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                                                                whileTap={{ scale: 0.97 }}
                                                            >
                                                                Cancel
                                                            </motion.button>
                                                            <motion.button
                                                                type="submit"
                                                                className="px-5 py-2.5 bg-green-500 text-white rounded-lg shadow-sm shadow-green-200"
                                                                whileHover={{ 
                                                                    scale: 1.03,
                                                                    backgroundColor: "#22c55e",
                                                                    transition: { duration: 0.2 }
                                                                }}
                                                                whileTap={{ scale: 0.97 }}
                                                            >
                                                                Add to Cart
                                                            </motion.button>
                                                        </div>
                                                    </form>
                                                </motion.div>
                                            </motion.div>
                                    )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default Menu;