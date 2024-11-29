import { useState, useMemo } from "react";
import { FaSearch, FaHeart } from 'react-icons/fa';
import Header from "../../Components/Common/Header";
import debounce from 'lodash/debounce';

const Favourites = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [menuSearchQuery, setMenuSearchQuery] = useState("");
    const [debouncedMenuSearch, setDebouncedMenuSearch] = useState("");
    const [sortOrder, setSortOrder] = useState('none');

    // Dummy data for favorites
    const dummyFavorites = useMemo(() => [
        {
            _id: '1',
            name: 'Margherita Pizza',
            description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
            price: 299,
            image: '',
            restaurant: 'Pizza Paradise',
            category: 'Pizza'
        },
        {
            _id: '2',
            name: 'Chicken Biryani',
            description: 'Aromatic basmati rice cooked with tender chicken and spices',
            price: 249,
            image: '',
            restaurant: 'Biryani House',
            category: 'Main Course'
        },
        {
            _id: '3',
            name: 'Chocolate Brownie',
            description: 'Rich and fudgy chocolate brownie with vanilla ice cream',
            price: 149,
            image: '',
            restaurant: 'Sweet Treats',
            category: 'Desserts'
        },
    ], []);

    // Create debounced function for menu search
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
        if (!query) return dummyFavorites;

        return dummyFavorites.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.restaurant.toLowerCase().includes(query)
        );
    }, [debouncedMenuSearch, dummyFavorites]);

    const sortedFavorites = useMemo(() => {
        if (sortOrder === 'none') return filteredFavorites;
        
        return [...filteredFavorites].sort((a, b) => {
            if (sortOrder === 'lowToHigh') return a.price - b.price;
            if (sortOrder === 'highToLow') return b.price - a.price;
            return 0;
        });
    }, [filteredFavorites, sortOrder]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header 
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                placeholderText="Search foods, restaurants, etc..."
            />

            {/* Search and Sort Section */}
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
                {!sortedFavorites.length && debouncedMenuSearch && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-xl text-gray-600">{`No favourites found matching - "${debouncedMenuSearch}"`}</p>
                        <p className="text-gray-500 mt-2">Try a different search term</p>
                    </div>
                )}

                {!sortedFavorites.length && !debouncedMenuSearch && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-xl text-gray-600">No favourites added yet</p>
                        <p className="text-gray-500 mt-2">Start adding items to your favourites!</p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 gap-6">
                    {sortedFavorites.map((item) => (
                        <div key={item._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start hover:shadow-xl transition-shadow duration-300">
                            <div className="flex-1 mb-4 md:mb-0">
                                <h4 className="text-2xl font-semibold mb-3 text-gray-900">{item.name}</h4>
                                <p className="text-gray-500 mb-3">{item.description}</p>
                                <p className="text-xl font-bold text-green-600 mb-3">₹{item.price}</p>
                                <p className="text-lg font-semibold text-indigo-600 mb-3">{item.restaurant}</p>
                                <button 
                                    className="w-fit p-2 bg-gray-100 rounded-full transition-colors duration-300"
                                >
                                    <FaHeart className="text-red-500 text-2xl" />
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
            </div>
        </div>
    );
};

export default Favourites;