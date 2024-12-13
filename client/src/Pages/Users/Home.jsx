import { FaStar } from "react-icons/fa";
import { getRestaurantsForUser } from "../../Services/apiServices";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { RingLoader } from 'react-spinners';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Common/Header";
import { calculateDistanceAndTime } from '../../utils/distanceUtils';

const Home = () => {
    const navigate = useNavigate();
    const [restaurantData, setRestaurantData] = useState([])
    const [locationAvailable, setLocationAvailable] = useState(false);
    const [sortType, setSortType] = useState('nearest');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const userLocation = useSelector((state) => state?.userLocation)
    const { lat, lng: lon } = userLocation.coordinates || {}
    const [searchQuery, setSearchQuery] = useState('');

    const fetchRestaurants = useCallback(async () => {
        const response = await getRestaurantsForUser(lat, lon)
        if (response?.data) {
            const sortedData = [...response.data].sort((a, b) => a.distance - b.distance);
            setRestaurantData(sortedData)
            setLocationAvailable(true)
        }
    }, [lat, lon])

    useEffect(() => {
        if (lat !== undefined && lon !== undefined) {
            fetchRestaurants()
        } else {
            console.error("Please enable location services to view nearby restaurants")
        }
    }, [lat, lon, fetchRestaurants])

    const handleRestaurantClick = (restaurantId) => {
        navigate(`restaurant/${restaurantId}/menu`);
    };

    const handleSort = (type) => {
        setSortType(type);
        let sortedData = [...restaurantData];
        
        switch(type) {
            case 'nearest':
                sortedData.sort((a, b) => a.distance - b.distance);
                break;
            case 'farthest':
                sortedData.sort((a, b) => b.distance - a.distance);
                break;
            case 'offers':
                sortedData = sortedData.filter(restaurant => restaurant.offerName);
                break;
            case 'rating':
                sortedData.sort((a, b) => b.avgRating - a.avgRating);
                break;
            default:
                break;
        }
        
        setRestaurantData(sortedData);
    };

    return (
        <div
            className="p-1"
        >
            <Header 
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                placeholderText="Search foods, restaurants, etc..."
            />
            <div className="p-6">
                {!locationAvailable ? (
                    <div className="flex flex-col justify-center items-center">
                        <RingLoader size={30} color="#FF5733" className="mb-5" />
                        <p className="text-lg text-gray-600 mt-4 animate-pulse">Finding restaurants nearby...</p>
                    </div>
                ) : (
                    <> 
                        <div className="mb-6 px-4 sm:px-0">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Restaurants Near You</h2>
                            <div className="flex justify-end">
                                <div className="relative w-48">
                                    <button 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm w-full"
                                    >
                                        <span className="text-gray-700">Sort By: </span>
                                        <span className="font-medium text-orange-500">
                                            {sortType === 'none' ? 'Select Option' : 
                                             sortType === 'nearest' ? 'Nearest' :
                                             sortType === 'farthest' ? 'Farthest' :
                                             sortType === 'offers' ? 'Offers Only' :
                                             sortType === 'rating' ? 'Rating' : ''}
                                        </span>
                                        <svg 
                                            className={`w-5 h-5 transition-transform ml-auto ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ 
                                            opacity: isDropdownOpen ? 1 : 0,
                                            y: isDropdownOpen ? 0 : -20,
                                            display: isDropdownOpen ? 'block' : 'none'
                                        }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute right-0 top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                                    >
                                        <div className="py-1">
                                            {[
                                                { value: 'nearest', label: 'Nearest' },
                                                { value: 'farthest', label: 'Farthest' },
                                                { value: 'offers', label: 'Offers Only' },
                                                { value: 'rating', label: 'Rating' }
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        handleSort(option.value);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                                                        sortType === option.value 
                                                            ? 'text-orange-500 bg-orange-50 font-medium' 
                                                            : 'text-gray-700 hover:bg-orange-50'
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0"
                        >
                            {restaurantData.length === 0 ? (
                                <div className="flex flex-col justify-center items-center">
                                    <RingLoader size={50} color="#FF5733" className="mb-5" />
                                    <p className="text-lg text-gray-600 mt-4 animate-ping">Finding restaurants nearby...</p>
                                </div>
                            ) : (
                                restaurantData.map((restaurant) => {
                                    const { distanceInKm, timeInMinutes } = calculateDistanceAndTime(restaurant.distance);
                                    return (
                                        <motion.div
                                            key={restaurant._id}
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.1 }}
                                            className="bg-white w-full sm:w-[90%] rounded-lg shadow-md overflow-hidden hover:shadow-2xl hover:scale-[1.01] hover:bg-orange-50 transform transition-all duration-300 cursor-pointer"
                                            onClick={() => handleRestaurantClick(restaurant._id)}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={restaurant.image}
                                                    alt={restaurant.name}
                                                    className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                                                />
                                                {restaurant.offerName && (
                                                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-sm sm:text-md font-semibold px-3 py-1 rounded-md shadow-md">
                                                        {restaurant.offerName}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                                                    {restaurant.name}
                                                </h3>

                                                <div className="flex items-center mb-3">
                                                    <div className={`flex items-center px-2 py-1 rounded-md ${restaurant?.avgRating ? (restaurant.avgRating >= 3.5 ? 'bg-green-600' : 'bg-orange-500') : 'bg-red-500'}`}>
                                                        <FaStar className="text-yellow-400 text-sm mr-1" />
                                                        <span className="text-sm font-bold text-white">
                                                            {restaurant?.avgRating ? Number(restaurant.avgRating).toFixed(1) : "No Rating Yet"}
                                                        </span>
                                                    </div>

                                                    <span className="ml-3 text-xs sm:text-sm font-medium text-gray-600">
                                                        {distanceInKm} Km • {timeInMinutes} Mins
                                                    </span>
                                                </div>

                                                <p className="text-xs sm:text-sm text-gray-600">{restaurant.address}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;