import PropTypes from 'prop-types';
import { FaShoppingCart } from "react-icons/fa";

const SearchBarWithCart = ({ searchQuery, setSearchQuery, placeholderText }) => {
    return (
        <div className="flex items-center w-full bg-white rounded-md p-2">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholderText}
                className="flex-grow px-4 py-2.5 bg-gray-200 placeholder:text-gray-400 rounded-md focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500 text-xl"
            />
            <div className="bg-orange-500 flex items-center justify-center rounded-md p-3 cursor-pointer hover:bg-orange-600 transition duration-300 ml-2">
                <FaShoppingCart className="text-white text-2xl" />
            </div>
        </div>
    );
};

SearchBarWithCart.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
    placeholderText: PropTypes.string
};

SearchBarWithCart.defaultProps = {
    placeholderText: 'Search...'
};

export default SearchBarWithCart;
