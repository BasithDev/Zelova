import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { FaStar, FaPhoneAlt } from 'react-icons/fa';
import { MdEdit } from "react-icons/md";
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useSelector } from 'react-redux';
import Map from '../../Components/Map/Map';

const InputField = ({ label, value, onChange, isEditable, type }) => (
    <div className="flex flex-col">
        <label className="text-lg font-medium text-gray-600 mb-2">{label}:</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            disabled={!isEditable}
            className={`py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${isEditable ? "focus:ring-blue-500" : "bg-gray-100"}`}
        />
    </div>
);

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    isEditable: PropTypes.bool.isRequired,
    type: PropTypes.string,
};

InputField.defaultProps = {
    type: "text",
};

const ManageRestaurant = () => {
    const restaurantData = useSelector((state) => state.restaurantData.data?.restaurant);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const defaultDetails = {
        name: "No name",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        address: "Add Address",
        phone: "Add Phone Number",
        openingTime: "09:00",
        closingTime: "21:00",
        photoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9oBl8oMj8unCKsHx9WuzVKgxc34HJnei-Qw&s",
    };
    const [restaurantDetails, setRestaurantDetails] = useState(defaultDetails);

    useEffect(() => {
        if (restaurantData) {
            setRestaurantDetails({ ...defaultDetails, ...restaurantData });
        }
    }, [restaurantData]);

    const handleFieldChange = (field, value) => {
        setRestaurantDetails((prev) => ({ ...prev, [field]: value }));
    };

    const toggleShopStatus = () => setIsOpen(!isOpen);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async ({ coords: { latitude, longitude } }) => {
                setCoordinates({ lat: latitude, lng: longitude });
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GMAP_KEY}`
                );
                const data = await response.json();
                if (data.results?.[0]) {
                    handleFieldChange("address", data.results[0].formatted_address);
                }
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleLocationSelect = (address, lat, lng) => {
        handleFieldChange("address", address);
        setCoordinates({ lat, lng });
    };

    const detailFields = {
        "Restaurant Name": "name",
        Description: "description",
        "Phone Number": "phone",
        "Opening Time": "openingTime",
        "Closing Time": "closingTime",
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold text-center mb-8">Manage Restaurant</h1>

            <motion.div
                className="flex relative flex-col md:flex-row max-w-6xl mx-auto rounded-lg shadow-2xl overflow-hidden p-3 bg-slate-100 mb-8"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
                <div className="relative rounded-lg w-full md:w-1/3 h-96 md:h-auto group">
                    <img
                        src={restaurantDetails.photoUrl}
                        alt="Restaurant"
                        className="w-full h-full object-cover rounded-lg shadow-xl"
                    />
                    <MdEdit
                        className="absolute bottom-2 right-2 flex items-center text-3xl bg-green-500 bg-opacity-50 cursor-pointer p-1 justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                    />
                </div>

                <motion.button
                    onClick={toggleShopStatus}
                    className={`absolute top-4 right-4 px-3 py-1 text-xl font-semibold rounded-md text-white ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isOpen ? "Open" : "Closed"}
                </motion.button>

                <div className="flex-1 p-3 flex flex-col justify-between">
                    <h2 className="text-4xl font-semibold text-gray-800 mb-4">{restaurantDetails.name}</h2>
                    <p className="text-gray-600 mb-6">{restaurantDetails.description}</p>
                    <div className="flex items-center mb-6 bg-green-500 text-white py-1 px-2 rounded-md w-max">
                        <FaStar className="mr-2 text-2xl text-yellow-400" />
                        <span className="font-semibold text-2xl">4.7</span>
                    </div>
                    <p className="text-lg font-medium text-gray-800 mb-2">Contact Information:</p>
                    <div className="space-y-2 text-gray-600">
                        <div className="flex items-center">
                            <FaPhoneAlt className="mr-2 text-gray-500" />
                            <span>{restaurantDetails.phone}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="flex flex-col max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
                <h2 className="text-3xl font-semibold mb-4">{isEditing ? 'Edit Restaurant Details' : 'Restaurant Details'}</h2>
                <div className="flex flex-col gap-4">
                    {Object.entries(detailFields).map(([label, key]) => (
                        <InputField
                            key={key}
                            label={label}
                            value={restaurantDetails[key]}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            isEditable={isEditing}
                            type={key.includes("Time") ? "time" : "text"}
                        />
                    ))}
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-6 px-6 py-2 text-xl font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                    {isEditing ? "Save" : "Edit"}
                </button>
            </motion.div>

            <motion.div
                className="flex flex-col max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6 mt-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
                <h2 className="text-3xl font-semibold mb-4">Restaurant Location</h2>
                <div className="flex items-center gap-4">
                    <div className="flex-grow">
                        <InputField
                            label="Address"
                            value={restaurantDetails.address}
                            onChange={(e) => handleFieldChange("address", e.target.value)}
                            isEditable
                        />
                    </div>
                    <button
                        data-tooltip-id="location-tooltip"
                        data-tooltip-content="Click here to get your current address and pin location in map"
                        onClick={getCurrentLocation}
                        className="h-full self-end py-2 px-6 bg-blue-500 text-xl font-semibold text-white rounded-md hover:bg-blue-600"
                    >
                        Detect Location
                    </button>
                </div>
                <Tooltip id="location-tooltip" />
                <Map lat={coordinates.lat} lng={coordinates.lng} onLocationSelect={handleLocationSelect} />
                <button
                    className="mt-6 px-6 py-2 text-xl font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                    Save
                </button>
            </motion.div>
        </div>
    );
};

export default ManageRestaurant;