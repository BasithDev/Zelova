import { FaMapMarkerAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';

const RestaurantHeader = ({ restaurant = null }) => {
    if (!restaurant) return null;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 sm:mb-6">
            <div className="h-24 sm:h-32 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 relative">
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
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shadow-lg -mt-12 border-4 border-white bg-white mx-auto sm:mx-0">
                        <img 
                            src={restaurant?.image} 
                            alt={restaurant?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{restaurant?.name}</h1>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                                <div className="bg-green-100 px-3 py-1 rounded-lg">
                                    <span className="text-green-700 text-sm font-medium">Open</span>
                                </div>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 mt-2">
                                <span className="hidden sm:inline-flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-orange-500" />
                                </span>
                                {restaurant?.address}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                            <span className="bg-orange-50 text-orange-600 text-xs sm:text-sm px-3 py-1 rounded-full">Fast Food</span>
                            <span className="bg-orange-50 text-orange-600 text-xs sm:text-sm px-3 py-1 rounded-full">Burgers</span>
                            <span className="bg-orange-50 text-orange-600 text-xs sm:text-sm px-3 py-1 rounded-full">Beverages</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

RestaurantHeader.propTypes = {
    restaurant: PropTypes.shape({
        name: PropTypes.string,
        address: PropTypes.string,
        image: PropTypes.string,
    })
};

export default RestaurantHeader;
