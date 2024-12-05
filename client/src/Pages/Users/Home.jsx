import { FaStar } from "react-icons/fa";
import { getRestaurantsForUser } from "../../Services/apiServices";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { RingLoader } from 'react-spinners';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../Components/Common/Header";
import { calculateDistanceAndTime } from '../../utils/distanceUtils';

const Home = () => {
    const navigate = useNavigate();
    const [restaurantData, setRestaurantData] = useState([])
    const [locationAvailable, setLocationAvailable] = useState(false);
    const userLocation = useSelector((state) => state?.userLocation)
    const { lat, lng: lon } = userLocation.coordinates || {}
    const [searchQuery, setSearchQuery] = useState('');

    const fetchRestaurants = useCallback(async () => {
        const response = await getRestaurantsForUser(lat, lon)
        if (response?.data) {
            setRestaurantData(response?.data)
            setLocationAvailable(true)
        }
    }, [lat, lon])

    useEffect(() => {
        if (lat !== undefined && lon !== undefined) {
            fetchRestaurants()
        } else {
            toast.error("Please enable location services to view nearby restaurants")
        }
    }, [lat, lon, fetchRestaurants])

    const handleRestaurantClick = (restaurantId) => {
        navigate(`restaurant/${restaurantId}/menu`);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="p-1"
        >
            <Header 
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                placeholderText="Search for restaurants or dishes..."
            />
            <div className="p-6">
                {!locationAvailable ? (
                    <div className="flex flex-col justify-center items-center">
                        <RingLoader size={30} color="#FF5733" className="mb-5" />
                        <p className="text-lg text-gray-600 mt-4 animate-pulse">Finding restaurants nearby...</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold mb-5 text-gray-900">Restaurants Near You</h2>
                        <p className="text-xl w-fit mb-4 font-bold bg-orange-100 text-orange-600 px-3 py-2 rounded-md shadow-sm">
                            Most Sellings
                        </p>
                        <div className="mb-6 flex items-center gap-4 overflow-x-auto hide-scrollbar">
                            {["Burger", "Cakes", "Pizza", "Mandi", "Biryani", "Shawarma", "Juices"].map((category, index) => (
                                <button
                                    key={index}
                                    className="bg-gray-100 border-2 border-gray-200 font-medium rounded-md px-5 py-2 text-base text-gray-700 hover:bg-orange-500 hover:border-transparent hover:text-white transition-all duration-300 shadow-sm"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurantData.length === 0 ? (
                                <div className="flex flex-col justify-center items-center">
                                    <RingLoader size={50} color="#FF5733" className="mb-5" />
                                    <p className="text-lg text-gray-600 mt-4 animate-ping">Finding restaurants nearby...</p>
                                </div>
                            ) : (
                                restaurantData.map((restaurant) => {
                                    const { distanceInKm, timeInMinutes } = calculateDistanceAndTime(restaurant.distance);
                                    return (
                                        <div
                                            key={restaurant._id}
                                            className="bg-white w-[80%] rounded-lg shadow-md overflow-hidden hover:shadow-2xl hover:scale-[1.01] hover:bg-orange-50 transform transition-all duration-300 cursor-pointer"
                                            onClick={() => handleRestaurantClick(restaurant._id)}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={restaurant.image}
                                                    alt={restaurant.name}
                                                    className="w-full h-64 object-cover"
                                                />
                                                {restaurant.offerName && (
                                                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-md font-semibold px-3 py-1 rounded-md shadow-md">
                                                        {restaurant.offerName}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4">
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                    {restaurant.name}
                                                </h3>

                                                <div className="flex items-center mb-3">
                                                    <div className={`flex items-center px-2 py-1 rounded-md ${restaurant?.rating ? (restaurant.rating >= 3.5 ? 'bg-green-600' : 'bg-orange-500') : 'bg-orange-500'}`}>
                                                        <FaStar className="text-yellow-400 text-sm mr-1" />
                                                        <span className="text-sm font-bold text-white">
                                                            {restaurant?.rating || "No Rating Yet"}
                                                        </span>
                                                    </div>
                                                    <span className="ml-3 text-sm font-medium text-gray-600">
                                                        {distanceInKm} Km • {timeInMinutes} Mins
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-600">{restaurant.address}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default Home;