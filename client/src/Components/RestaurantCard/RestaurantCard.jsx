import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';

const RestaurantCard = ({ restaurant, timeInMinutes, distanceInKm }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="h-32 sm:h-40 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 relative">
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
            <div className="p-4 sm:p-6 relative">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden shadow-lg -mt-12 sm:-mt-16 border-4 border-white bg-white">
                        <img 
                            src={restaurant.image} 
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2 sm:gap-0">
                            <div className="text-center sm:text-left">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{restaurant.name}</h1>
                                <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2 mt-1">
                                    <FaMapMarkerAlt className="hidden sm:block text-orange-500" />
                                    {restaurant.address}
                                </p>
                                <p className="text-gray-600 mt-1">Phone: {restaurant.phone}</p>
                            </div>
                            <div className={`${restaurant.avgRating >= 3.5 ? "bg-green-600" : "bg-orange-500"} text-white rounded-lg px-3 py-1`}>
                                <span className="text-base sm:text-lg flex items-center font-semibold">
                                    {restaurant.avgRating || "No Rating Yet"}
                                    <FaStar className="inline ml-1 text-yellow-400" />
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                            <span className="bg-orange-50 text-orange-600 text-xs sm:text-sm px-3 py-1 rounded-full">Fast Food</span>
                            <span className="bg-orange-50 text-orange-600 text-xs sm:text-sm px-3 py-1 rounded-full">Restaurant</span>
                            <span className="bg-orange-50 text-orange-600 text-xs sm:text-sm px-3 py-1 rounded-full">Beverages</span>
                        </div>
                        {/* Delivery Progress */}
                        <div className="mt-4 border-t pt-4">
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <div className={`w-3 h-3 ${timeInMinutes < 15 ? 'bg-green-600' : timeInMinutes <= 30 ? 'bg-orange-500' : 'bg-red-500'} rounded-full`}></div>
                                    <p className="text-sm sm:text-base text-gray-600 ml-2">Outlet</p>
                                </div>
                                <div className={`h-12 flex items-center border-l-2 ml-[5px] ${timeInMinutes < 15 ? 'border-green-600' : timeInMinutes <= 30 ? 'border-orange-500' : 'border-red-500'}`}>
                                    <p className="text-sm sm:text-base text-gray-600 ml-2">
                                        {timeInMinutes} Mins • {distanceInKm} Km
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <div className={`w-3 h-3 ${timeInMinutes < 15 ? 'bg-green-600' : timeInMinutes <= 30 ? 'bg-orange-500' : 'bg-red-500'} rounded-full`}></div>
                                    <p className="text-sm sm:text-base text-gray-600 ml-2">Your Location</p>
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
        avgRating: PropTypes.number,
    }).isRequired,
    timeInMinutes: PropTypes.number.isRequired,
    distanceInKm: PropTypes.string.isRequired,
};

export default RestaurantCard;
