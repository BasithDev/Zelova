import PropTypes from 'prop-types';
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ text }) => {
    return (
        <div className="flex-grow m-0 shadow-lg rounded-md transition-all duration-200 flex focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500">
            <input
                type="text"
                className="w-full bg-gray-100 text-2xl p-2 px-3 rounded-l-md border-none focus:ring-0 focus:outline-none"
                placeholder={text ? `Search ${text}` : "Search here"}
            />
            <div className="bg-gray-300 hover:bg-orange-500 cursor-pointer flex items-center rounded-r-md group transition-all duration-300">
                <FaSearch className="text-2xl mx-3 text-gray-700 group-hover:text-white" />
            </div>
        </div>
    );
};

SearchBar.propTypes = {
    text: PropTypes.string,
};

SearchBar.defaultProps = {
    text: '',
};

export default SearchBar;
