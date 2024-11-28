import { FiMenu } from 'react-icons/fi';
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from 'prop-types';

const CategoryMenu = ({ isOpen, onToggle, categories, onCategoryClick }) => {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={onToggle}
                className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
            >
                <FiMenu size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-48"
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => onCategoryClick(category)}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                {category}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

CategoryMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    onCategoryClick: PropTypes.func.isRequired
};

export default CategoryMenu;
