import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CustomizationModal = ({ isOpen, onClose, item, onConfirm }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (isOpen && item && item.customizations.length > 0) {
            // Set the first option as selected by default
            if (item.customizations[0].options.length > 0) {
                setSelectedOption(item.customizations[0].options[0]);
            } else {
                console.warn('No options available for customization:', item.customizations[0].fieldName);
            }
        }
    }, [isOpen, item]);

    const handleConfirm = () => {
        if (selectedOption) {
            onConfirm([{ fieldName: item.customizations[0].fieldName, option: selectedOption }]);
        }
        onClose();
    };

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
                <h2 className="text-2xl font-bold mb-4">Customize {item.name}</h2>
                <div className="mb-4">
                    <p className="text-gray-600 mb-2">{item.customizations[0].fieldName}</p>
                    {item.customizations[0].options.map(option => (
                        <div key={option._id} className="flex items-center mb-2">
                            <input 
                                type="radio" 
                                id={option._id} 
                                name="customization" 
                                value={option.name} 
                                onChange={() => setSelectedOption(option)}
                                checked={selectedOption?._id === option._id}
                                className="mr-2"
                            />
                            <label htmlFor={option._id} className="text-gray-700">
                                {option.name} - ₹{option.price}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
                    <button onClick={handleConfirm} className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={!selectedOption}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

CustomizationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        customizations: PropTypes.arrayOf(PropTypes.shape({
            fieldName: PropTypes.string.isRequired,
            options: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string.isRequired,
                price: PropTypes.number.isRequired,
                _id: PropTypes.string.isRequired
            })).isRequired
        }))
    }),
    onConfirm: PropTypes.func.isRequired
};

export default CustomizationModal;
