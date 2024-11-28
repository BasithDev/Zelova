import { FaSearch } from 'react-icons/fa';
import PropTypes from 'prop-types';

const MenuSearch = ({ menuSearchQuery, onSearchChange, sortOrder, onSortChange }) => {
    return (
        <div className="px-8 py-3">
            <div className="flex justify-between items-center gap-4">
                <div className="relative w-72">
                    <input
                        type="text"
                        value={menuSearchQuery}
                        onChange={onSearchChange}
                        placeholder="Search in menu..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 shadow-sm"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaSearch size={16} />
                    </div>
                </div>
                
                <select
                    value={sortOrder}
                    onChange={onSortChange}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 shadow-sm cursor-pointer"
                >
                    <option value="none">Sort by</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                </select>
            </div>
        </div>
    );
};

MenuSearch.propTypes = {
    menuSearchQuery: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    sortOrder: PropTypes.oneOf(['none', 'lowToHigh', 'highToLow']).isRequired,
    onSortChange: PropTypes.func.isRequired
};

export default MenuSearch;
