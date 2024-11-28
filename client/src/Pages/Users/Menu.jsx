import { useState, useEffect, useMemo } from "react";
import { FiMenu } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { getMenuForUser } from '../../Services/apiServices';
import { useSelector } from "react-redux";
import { RingLoader } from 'react-spinners';
import { calculateDistanceAndTime } from '../../utils/distanceUtils';
import RestaurantCard from "../../Components/RestaurantCard/RestaurantCard";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from 'react-toastify';
import Header from "../../Components/Common/Header";
import { FaSearch, FaHeart, FaRegHeart } from 'react-icons/fa';
import debounce from 'lodash/debounce';

const Menu = () => {
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

    const userLocation = useSelector((state) => state.userLocation);
    const { lat, lng: lon } = userLocation.coordinates;

    // Create debounced function for menu search
    const debouncedSetMenuSearch = useMemo(
        () => debounce((value) => {
            setDebouncedMenuSearch(value);
        }, 300),
        []
    );

    // Cleanup debounce on unmount
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
            <div className="px-8 py-3">
                <div className="flex justify-between items-center gap-4">
                    <div className="relative w-72">
                        <input
                            type="text"
                            value={menuSearchQuery}
                            onChange={handleMenuSearchChange}
                            placeholder="Search in menu..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 shadow-sm"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <FaSearch size={16} />
                        </div>
                    </div>
                    
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 shadow-sm cursor-pointer"
                    >
                        <option value="none">Sort by</option>
                        <option value="lowToHigh">Price: Low to High</option>
                        <option value="highToLow">Price: High to Low</option>
                    </select>
                </div>
            </div>

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
                            <h2 className="font-bold text-lg mb-2 text-center">{restaurant?.name} Menu</h2>
                            {Object.keys(filteredMenu).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className="w-full py-2 px-4 hover:bg-gray-100 rounded"
                                >
                                    {category}
                                </button>
                            ))}
                        </motion.div>
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
                                    <button 
                                        className="w-full px-4 py-2 text-xl bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
                                    >
                                        Add to Cart
                                    </button>
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