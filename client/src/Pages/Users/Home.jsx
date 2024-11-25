import SearchBar from "../../Components/SearchBar/SearchBar";
import { FaSort, FaTags, FaUtensils, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { getRestaurantsForUser } from "../../Services/apiServices";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";

const Home = () => {
    const [restaurantData,setRestaurantData] = useState([])
    const userLocation = useSelector((state)=>state.userLocation)
    const  {lat:lat,lng:lon} = userLocation.coordinates
    const fetchRestaurants = useCallback(async ()=>{
        const response = await getRestaurantsForUser(lat,lon)
        if (response?.data) {
            setRestaurantData(response?.data)   
        }
    },[lat, lon])

    useEffect(()=>{
        fetchRestaurants()
    },[fetchRestaurants])

    return (
        <>
            <div className="flex items-center gap-2 p-4 w-full">
                <SearchBar text={'foods, restaurants, and more...'} />
                <div className="bg-orange-500 flex items-center justify-center rounded-md p-2 cursor-pointer hover:bg-orange-600 transition duration-300">
                    <FaSort className="text-white text-3xl" />
                </div>
            </div>

            <div className="p-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Explore</h2>
                <div className="flex flex-wrap gap-4">
                    <div
                        className="flex flex-col items-center justify-center gap-1 bg-white shadow-xl hover:scale-95 rounded-lg p-3 cursor-pointer hover:shadow-2xl transition-all duration-300"
                        style={{ flex: "1 1 200px", maxWidth: "200px" }}
                        onClick={() => console.log("Offers clicked")}
                    >
                        <FaTags className="text-orange-500 text-7xl" />
                        <h3 className="text-lg font-semibold text-gray-800">Offers</h3>
                    </div>

                    <div
                        className="flex flex-col items-center justify-center gap-1 bg-white shadow-xl hover:scale-95 rounded-lg p-3 cursor-pointer hover:shadow-2xl transition-all duration-300"
                        style={{ flex: "1 1 200px", maxWidth: "200px" }}
                        onClick={() => console.log("Categories clicked")}
                    >
                        <FaUtensils className="text-blue-500 text-7xl" />
                        <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
                    </div>

                    <div
                        className="flex flex-col items-center justify-center gap-1 bg-white shadow-xl hover:scale-95 rounded-lg p-3 cursor-pointer hover:shadow-2xl transition-all duration-300"
                        style={{ flex: "1 1 200px", maxWidth: "200px" }}
                        onClick={() => console.log("Near Me clicked")}
                    >
                        <FaMapMarkerAlt className="text-green-500 text-7xl" />
                        <h3 className="text-lg font-semibold text-gray-800">Near Me</h3>
                    </div>
                </div>
            </div>
            <div className="p-6">
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
                    {restaurantData.map((restaurant) => (
                        <div
                            key={restaurant.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
                        >
                            <div className="relative">
                                <img
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    className="w-full h-56 object-cover"
                                />
                                {/* {restaurant.offer && (
                                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-md font-semibold px-3 py-1 rounded-md shadow-md">
                                        {restaurant.offer}
                                    </div>
                                )} */}
                            </div>

                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {restaurant.name}
                                </h3>

                                <div className="flex items-center mb-3">
                                    <div className="flex items-center bg-green-600 px-2 py-1 rounded-md">
                                        <FaStar className="text-yellow-400 text-sm mr-1" />
                                        <span className="text-sm font-bold text-white">
                                            {restaurant?.rating || "NO Rating Yet"}
                                        </span>
                                    </div>
                                    <span className="ml-3 text-sm font-medium text-gray-600">
                                        {Math.round(restaurant.distance/1000)} Km • {Math.round(((restaurant.distance/5.5)*60)/1000)} Mins
                                    </span> 
                                </div>

                                <p className="text-sm text-gray-600">{restaurant.address}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Home;