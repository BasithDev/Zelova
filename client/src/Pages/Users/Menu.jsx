import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { FiMenu } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { getMenuForUser } from "../../Services/apiServices";
import { useSelector } from "react-redux";
import { RingLoader } from 'react-spinners';
import { calculateDistanceAndTime } from '../../utils/distanceUtils';
import SearchBarWithCart from "../../Components/SearchBarWithCart/SearchBarWithCart";
import { AnimatePresence, motion } from "framer-motion";
import { FaMapMarkerAlt } from 'react-icons/fa';

const Menu = () => {
    const { id } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const userLocation = useSelector((state) => state.userLocation);
    const { lat, lng: lon } = userLocation.coordinates;
    const [isFabOpen, setIsFabOpen] = useState(false);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await getMenuForUser(id, lat, lon);
                if (response?.data) {
                    setRestaurant(response.data.restaurant);
                    setMenuItems(response.data.menu);
                }
            } catch (error) {
                console.error("Error fetching menu:", error);
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
                <RingLoader size={50} color="#FF5733" className="mb-5" />
                <p className="text-lg text-gray-600 mt-4 animate-pulse">Loading menu...</p>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="p-4 text-center">
                <p className="text-xl text-gray-600">Restaurant not found</p>
            </div>
        );
    }

    const { distanceInKm, timeInMinutes } = calculateDistanceAndTime(restaurant.distance);

    const filteredMenu = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    console.log(filteredMenu)

    const categorizedMenu = filteredMenu.reduce((acc, item) => {
        const categoryName = item.foodCategory.name;
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(item);
        return acc;
    }, {});

    const categories = Object.keys(categorizedMenu);

    const toggleFab = () => {
        setIsFabOpen(!isFabOpen);
    };

    const handleCategoryClick = (category) => {
        const categoryElement = document.getElementById(category);
        if (categoryElement) {
            categoryElement.scrollIntoView({ behavior: "smooth" });
            setIsFabOpen(false);
        }
    };

    return (
        <div className="px-4">
            <div className="flex items-center gap-2 p-4 w-full">
                <SearchBarWithCart 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholderText="foods, restaurants, and more..."
                />
            </div>
            {/* Restaurant Details Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="h-40 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 relative">
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
                        <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg -mt-16 border-4 border-white bg-white">
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
                                        {restaurant.address}
                                    </p>
                                    <p className="text-gray-600 mt-1">Phone: {restaurant.phone}</p>
                                </div>
                                <div className={`mb-4 ${restaurant.rating >= 4 ? "bg-green-500" : "bg-orange-500"} text-white rounded-lg px-3 py-1`}>
                                    <span className="text-lg font-semibold">{restaurant.rating || "No Rating Yet"}
                                        <FaStar className="inline ml-1 text-yellow-400" />
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                <span className="bg-orange-50 text-orange-600 text-sm px-3 py-1 rounded-full">Fast Food</span>
                                <span className="bg-orange-50 text-orange-600 text-sm px-3 py-1 rounded-full">Restaurant</span>
                                <span className="bg-orange-50 text-orange-600 text-sm px-3 py-1 rounded-full">Beverages</span>
                            </div>
                            {/* Delivery Progress */}
                            <div className="mt-4 border-t pt-4">
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 ${timeInMinutes < 15 ? 'bg-green-600' : timeInMinutes <= 30 ? 'bg-orange-500' : 'bg-red-500'} rounded-full`}></div>
                                        <p className="text-gray-600 ml-2">Outlet</p>
                                    </div>
                                    <div className={`h-12 flex items-center ml-1 border-l-2 ${timeInMinutes < 15 ? 'border-green-600' : timeInMinutes <= 30 ? 'border-orange-500' : 'border-red-500'}`}>
                                        <p className="text-gray-600 ml-2">Delivery In {timeInMinutes} Mins ({distanceInKm} Km)</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 ${timeInMinutes < 15 ? 'bg-green-600' : timeInMinutes <= 30 ? 'bg-orange-500' : 'bg-red-500'} rounded-full`}></div>
                                        <p className="text-gray-600 ml-2">Your Location</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Subheading */}
            <h2 className="text-3xl font-bold font-roboto mb-4 text-center">~ Menu ~</h2>

            {/* Search Bar */}
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Search for a dish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[70%] px-4 py-2 border-2 rounded-lg text-xl focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                />
            </div>

            {/* Menu Items by Category */}
            {Object.entries(categorizedMenu).length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 text-xl py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m0 0l-6-6m6 6H3m13 6l6-6m0 0l-6-6m6 6h-6" />
                    </svg>
                    <p className="mb-2">No items available in the menu.</p>
                    <p className="text-sm text-gray-400">Please check back later or try another search.</p>
                </div>
            ) : (
                Object.entries(categorizedMenu).map(([categoryName, items]) => (
                    <div key={categoryName} id={categoryName} className="px-8 py-2 mb-8">
                        <h3 className="text-2xl underline font-bold px-3 mb-4">{categoryName}</h3>
                        {items.map((item) => (
                            <div key={item._id} className="bg-white rounded-lg shadow-md mb-4 p-4 flex items-center">
                                <div className="flex-1 gap-4">
                                    <h4 className="text-3xl font-semibold mb-1">{item.name}</h4>
                                    <p className="text-gray-600 mb-1">{item.description}</p>
                                    <p className="text-gray-800 text-xl font-semibold mb-1">₹{item.price}</p>
                                    {item.offers ? (
                                        <p className="bg-green-100 text-green-600 w-fit px-2 py-1 rounded-md font-semibold">{item.offers.offerName}</p>
                                    ) : (
                                        <p className="bg-yellow-100 text-yellow-600 w-fit px-2 py-1 rounded-md font-semibold">BUY for 300+ GET Free Delivery</p>
                                    )}
                                </div>
                                <div className="flex pb-5 flex-col items-center relative">
                                    <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-md mr-4" />
                                    <button className="absolute bottom-0 bg-orange-500 text-white rounded-md px-4 py-1 font-semibold text-xl hover:bg-orange-600 transition duration-300">
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}

            {/* Floating Action Button for Menu */}
            <div className="fixed bottom-10 right-10">
                <button
                    onClick={toggleFab}
                    className="bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-300 hover:text-black hover:shadow-2xl transition duration-300"
                >
                    <FiMenu className="text-3xl" />
                </button>
                <AnimatePresence>
                {isFabOpen && (
                    <motion.div
                        initial={{ y: 50, scale: 0 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 50, scale: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute bottom-16 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-48 z-10"
                        style={{ transformOrigin: "bottom right" }}
                    >
                        <h1 className="font-bold text-center mb-2">{restaurant.name}&apos;s Menu</h1>
                        <ul className="divide-y divide-gray-200">
                            {categories.map((category) => (
                                <li key={category} onClick={() => handleCategoryClick(category)} className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-center">
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Menu;