import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';

const RestaurantCard = ({ restaurant, timeInMinutes, distanceInKm }) => {
    return (
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
                                <span className="text-lg font-semibold">
                                    {restaurant.rating || "No Rating Yet"}
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
    );
};

RestaurantCard.propTypes = {
    restaurant: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        rating: PropTypes.number,
    }).isRequired,
    timeInMinutes: PropTypes.number.isRequired,
    distanceInKm: PropTypes.string.isRequired,
};

export default RestaurantCard;
