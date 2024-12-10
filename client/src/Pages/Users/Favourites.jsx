import { useState, useMemo, useEffect } from "react";
import { FaSearch } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai'
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../Components/Common/Header";
import debounce from 'lodash/debounce';
import { getFavourites, removeFavorite } from "../../Services/apiServices";

const Favourites = () => {
    const [favourites, setFavourites] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [menuSearchQuery, setMenuSearchQuery] = useState("");
    const [debouncedMenuSearch, setDebouncedMenuSearch] = useState("");
    const [sortOrder, setSortOrder] = useState('none');
    const [showEmptyState, setShowEmptyState] = useState(false);

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const response = await getFavourites();
                setFavourites(response.data.favorites);
                setShowEmptyState(response.data.favorites.length === 0);
            } catch (error) {
                console.error("Error fetching favourites:", error);
                setShowEmptyState(true);
            }
        };
        fetchFavourites();
    }, []);

    const debouncedSetMenuSearch = useMemo(
        () => debounce((value) => {
            setDebouncedMenuSearch(value);
        }, 300),
        []
    );

    const handleMenuSearchChange = (e) => {
        const value = e.target.value;
        setMenuSearchQuery(value);
        debouncedSetMenuSearch(value);
    };

    const filteredFavorites = useMemo(() => {
        const query = debouncedMenuSearch.toLowerCase().trim();
        if (!query) return favourites

        return favourites.filter(fav =>
            fav.item.name.toLowerCase().includes(query) ||
            fav.item.description.toLowerCase().includes(query) ||
            fav.item.restaurantId.name.toLowerCase().includes(query)
        );
    }, [debouncedMenuSearch, favourites]);

    const sortedFavorites = useMemo(() => {
        if (sortOrder === 'none') return filteredFavorites;

        return [...filteredFavorites].sort((a, b) => {
            if (sortOrder === 'lowToHigh') return a.item.price - b.item.price;
            if (sortOrder === 'highToLow') return b.item.price - a.item.price;
            return 0;
        });
    }, [filteredFavorites, sortOrder]);

    const handleRemoveFavorite = async (foodItemId) => {
        try {
            await removeFavorite({ foodItemId:foodItemId });
            setFavourites(prevFavorites => prevFavorites.filter(fav => fav.item._id !== foodItemId));
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    const handleExitComplete = () => {
        if (sortedFavorites.length === 0) {
            setShowEmptyState(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                placeholderText="Search foods, restaurants, etc..."
            />

            <div className="px-8 py-3">
                <div className="flex justify-between items-center gap-4">
                    <div className="relative w-72">
                        <input
                            type="text"
                            value={menuSearchQuery}
                            onChange={handleMenuSearchChange}
                            placeholder="Search in favourites..."
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

            <div className="pb-20 px-8">
                {showEmptyState && !debouncedMenuSearch && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center py-12"
                    >
                        <p className="text-xl text-gray-600">No favourites added yet</p>
                        <p className="text-gray-500 mt-2">Start adding items to your favourites!</p>
                    </motion.div>
                )}

                {!sortedFavorites.length && debouncedMenuSearch && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-xl text-gray-600">{`No favourites found matching - "${debouncedMenuSearch}"`}</p>
                        <p className="text-gray-500 mt-2">Try a different search term</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence onExitComplete={handleExitComplete}>
                    {sortedFavorites.map((item) => (
                        <motion.div
                            key={item._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:bg-orange-50 cursor-pointer transition-all duration-200 hover:shadow-lg relative"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="relative">
                                {item.item.image && (
                                    <motion.img
                                        src={item.item.image}
                                        alt={item.item.name}
                                        className="w-full h-64 object-cover"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                                {item.item.offers && (
                                    <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                                        {item.item.offers.offerName}
                                    </div>
                                )}
                            </div>
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => handleRemoveFavorite(item.item._id)}
                                    className="focus:outline-none"
                                >
                                    <AiFillHeart 
                                        className="text-red-500 text-2xl hover:scale-110 transition-all duration-300" 
                                    />
                                </button>
                            </div>
                            <div className="p-4">
                                <h4 className="text-xl font-bold text-gray-900 truncate mb-2">
                                    {item.item.name}
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                    {item.item.description}
                                </p>
                                <p className="text-lg font-semibold text-green-500 mb-2">
                                    ₹{item.item.price}
                                </p>
                                {item.item.restaurantId && (
                                    <div className="text-gray-700">
                                        <p className="font-bold text-gray-800 text-xl"><span className="font-semibold text-sm text-indigo-700">From: </span> {item.item.restaurantId.name}</p>
                                        <p className="text-gray-500">{item.item.restaurantId.address}</p>
                                    </div>
                                )}
                                
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Favourites;