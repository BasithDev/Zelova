import { useState, useEffect, useMemo } from "react";
import { FiMenu } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { getMenuForUser } from '../../Services/apiServices';
import { useSelector } from "react-redux";
import { calculateDistanceAndTime } from '../../utils/distanceUtils';
import RestaurantCard from "../../Components/RestaurantCard/RestaurantCard";
import { AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import Header from "../../Components/Common/Header";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import MenuSearch from "../../Components/MenuSearch/MenuSearch";
import CategoryMenu from "../../Components/CategoryMenu/CategoryMenu";
import { useCart } from "../../Hooks/useCart";

const Menu = () => {

    const {
        cart,
        updateCartMutation,
    } = useCart();

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

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setSelectedCustomizations({});
    };

    const handleCustomizationChange = (fieldName, option) => {
        setSelectedCustomizations({
            ...selectedCustomizations,
            [fieldName]: {
                name: option.name,
                price: option.price
            }
        });
    };

    const handleOkClick = () => {
        if (!selectedItem) return;

        // Transform selectedCustomizations into the required format
        const formattedCustomizations = Object.entries(selectedCustomizations).map(([fieldName, option]) => ({
            fieldName,
            options: option
        }));

        // Call handleCartUpdation with the formatted customizations
        handleCartUpdation(selectedItem._id, 'add', formattedCustomizations);

        // Close the modal
        closeModal();
    };

    const handleCustomizableItemUpdate = (item, action) => {
        const cartItem = cart.data?.cart?.items?.find(
            (cartItem) => cartItem?.item._id === item._id
        );

        if (action === 'add') {
            if (!cartItem) {
                openModal(item);
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

    const toggleFavorite = (itemId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(itemId)) {
                newFavorites.delete(itemId);
            } else {
                newFavorites.add(itemId);
            }
            return newFavorites;
        });
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await getMenuForUser(id, lat, lon);
                if (response?.data) {
                    setRestaurant(response.data.restaurant);
                    setMenuItems(response.data.menu);
                } else {
                    toast.error("No menu data found");
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
        } else {
            toast.error("Invalid restaurant or location details");
            setLoading(false);
        }
    }, [id, lat, lon]);

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
                                            // Show quantity controls for customizable items in cart
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleCustomizableItemUpdate(item, 'remove')}
                                                    className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-300 transition-colors duration-300"
                                                >
                                                    -
                                                </button>
                                                <p className="text-lg font-semibold">
                                                    {cart.data?.cart?.items?.find(
                                                        (cartItem) => cartItem?.item._id === item._id
                                                    )?.quantity}
                                                </p>
                                                <button
                                                    onClick={() => handleCustomizableItemUpdate(item, 'add')}
                                                    className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-300 transition-colors duration-300"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="ml-2 px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                                                >
                                                    Change Options
                                                </button>
                                            </div>
                                        ) : (
                                            // Show customize button for items not in cart
                                            <button
                                                onClick={() => openModal(item)}
                                                className="w-full px-4 py-2 text-xl bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                                            >
                                                Customize & Add
                                            </button>
                                        )
                                    ) : (
                                        cart.data?.cart?.items?.find((cartItem) => cartItem?.item._id === item._id)?.quantity > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleCartUpdation(item._id, 'remove')}
                                                    className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-300 transition-colors duration-300"
                                                >
                                                    -
                                                </button>
                                                <p className="text-lg font-semibold">
                                                    {cart.data?.cart?.items?.find((cartItem) => cartItem?.item._id === item._id)?.quantity}
                                                </p>
                                                <button
                                                    onClick={() => handleCartUpdation(item._id, 'add')}
                                                    className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-300 transition-colors duration-300"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleCartUpdation(item._id, 'add')}
                                                className="w-full px-4 py-2 text-xl bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                                            >
                                                Add to Cart
                                            </button>
                                        )
                                    )}

                                    {isModalOpen && selectedItem && (
                                        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                                            <div className="bg-white p-6 rounded-lg w-96">
                                                <h2 className="text-xl font-bold mb-4">Customize {selectedItem.name}</h2>

                                                {selectedItem.customizations.map((customization) => (
                                                    <div key={customization._id}>
                                                        <h3 className="font-semibold">{customization.fieldName}</h3>
                                                        <div className="flex gap-4">
                                                            {customization.options.map((option) => (
                                                                <button
                                                                    key={option._id}
                                                                    onClick={() => handleCustomizationChange(customization.fieldName, option)}
                                                                    className={`px-4 py-2 rounded-lg ${
                                                                        selectedCustomizations[customization.fieldName]?.name === option.name 
                                                                            ? 'bg-blue-500 text-white' 
                                                                            : 'bg-gray-200'
                                                                    }`}
                                                                >
                                                                    {option.name} - ₹{option.price}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="mt-4 flex justify-between">
                                                    <button
                                                        onClick={closeModal}
                                                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleOkClick}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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