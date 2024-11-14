import { useState } from 'react';
import { FaStar, FaPhoneAlt } from 'react-icons/fa';
import { MdEdit } from "react-icons/md";
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

const ManageRestaurant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openingTime, setOpeningTime] = useState("09:00");
    const [closingTime, setClosingTime] = useState("21:00");
    const [restaurantName, setRestaurantName] = useState("Restaurant Name");
    const [description, setDescription] = useState("Lorem ipsum dolor sit amet, consectetur adipisicing elit.");
    const [address, setAddress] = useState("1234 Street, City, Country");
    const [phone, setPhone] = useState("+1 234 567 890");
    const [photoUrl, setPhotoUrl] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9oBl8oMj8unCKsHx9WuzVKgxc34HJnei-Qw&s");
    const [isEditing, setIsEditing] = useState(false);
    const [isLocationEditing, setIsLocationEditing] = useState(false);
    const handleEditClick = () => setIsEditing(true);
    const handleSaveClick = () => setIsEditing(false);
    const toggleShopStatus = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold text-center mb-8">Manage Restaurant</h1>
            
            {/* Restaurant Card */}
            <motion.div
                className="flex relative flex-col md:flex-row max-w-6xl mx-auto rounded-lg shadow-2xl overflow-hidden p-3 bg-slate-100 mb-8"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
                <div className="relative rounded-lg w-full md:w-1/3 h-96 md:h-auto group">
                    <img
                        src={photoUrl}
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
                    <h2 className="text-4xl font-semibold text-gray-800 mb-4">{restaurantName}</h2>
                    <p className="text-gray-600 mb-6">{description}</p>
                    <div className="flex items-center mb-6 bg-green-500 text-white py-1 px-2 rounded-md w-max">
                        <FaStar className="mr-2 text-2xl text-yellow-400" />
                        <span className="font-semibold text-2xl">4.7</span>
                    </div>
                    <p className="text-lg font-medium text-gray-800 mb-2">Contact Information:</p>
                    <div className="space-y-2 text-gray-600">
                        <div className="flex items-center">
                            <FaPhoneAlt className="mr-2 text-gray-500" />
                            <span>{phone}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Restaurant Details Card */}
            <motion.div 
                className="flex flex-col items-center max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6 mt-12"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">{isEditing ? 'Edit Restaurant Details' : 'Restaurant Details'}</h2>
                <div className="flex flex-col gap-4 w-full mb-4">
                    <div className="flex flex-col">
                        <label className="text-lg font-medium text-gray-600 mb-2" htmlFor="restaurant-name">
                            Restaurant Name:
                        </label>
                        <input
                            type="text"
                            id="restaurant-name"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            disabled={!isEditing}
                            className={`py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${isEditing ? "focus:ring-blue-500" : "bg-gray-100"}`}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-lg font-medium text-gray-600 mb-2" htmlFor="description">
                            Description:
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={!isEditing}
                            className={`py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${isEditing ? "focus:ring-blue-500" : "bg-gray-100"}`}
                        ></textarea>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-lg font-medium text-gray-600 mb-2" htmlFor="phone">
                            Phone Number:
                        </label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={!isEditing}
                            className={`py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${isEditing ? "focus:ring-blue-500" : "bg-gray-100"}`}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex flex-col w-full">
                        <label className="text-lg font-medium text-gray-600 mb-2" htmlFor="opening-time">
                            Opening Time:
                        </label>
                        <input
                            type="time"
                            id="opening-time"
                            value={openingTime}
                            onChange={(e) => setOpeningTime(e.target.value)}
                            disabled={!isEditing}
                            className={`py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${isEditing ? "focus:ring-blue-500" : "bg-gray-100"}`}
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-lg font-medium text-gray-600 mb-2" htmlFor="closing-time">
                            Closing Time:
                        </label>
                        <input
                            type="time"
                            id="closing-time"
                            value={closingTime}
                            onChange={(e) => setClosingTime(e.target.value)}
                            disabled={!isEditing}
                            className={`py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${isEditing ? "focus:ring-blue-500" : "bg-gray-100"}`}
                        />
                    </div>
                </div>
                <div className="flex justify-end w-full mt-6">
                    {isEditing ? (
                        <button
                            onClick={handleSaveClick}
                            className="px-6 py-2 w-full font-semibold text-xl text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all duration-200 focus:outline-none"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={handleEditClick}
                            className="px-6 py-2 w-full font-semibold text-xl text-white bg-green-500 rounded-md hover:bg-green-600 transition-all duration-200 focus:outline-none"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Restaurant Location Card */}
            <motion.div
            className="flex flex-col items-center max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6 mt-12"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Restaurant Location</h2>
            
            {/* Address Input */}
            <div className="flex flex-col gap-4 w-full mb-4">
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-600 mb-2" htmlFor="address">
                        Address:
                    </label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-gray-100"
                    />
                </div>

                {/* "Get Current Location" Button */}
                <button
                data-tooltip-id="my-tooltip" data-tooltip-content="Click here to get your current address and pin location in map"
                    className="py-2 px-6 mt-4 bg-blue-500 font-semibold text-xl text-white rounded-md transition-all duration-200 hover:bg-blue-600 focus:outline-none"
                    onClick={() => console.log('Get current location button clicked')}
                >
                    Get Current Location
                </button>
                <Tooltip id="my-tooltip" />
            </div>

            {/* Map Container */}
            <div className="w-full h-80 mt-6 bg-gray-200 rounded-md flex items-center justify-center">
                <p className="text-lg text-gray-600">Map Placeholder</p>
            </div>

            <div className="flex justify-end w-full mt-6">
                    {isLocationEditing ? (
                        <button
                            onClick={()=>setIsLocationEditing(false)}
                            className="px-6 py-2 w-full font-semibold text-xl text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all duration-200 focus:outline-none"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={()=>setIsLocationEditing(true)}
                            className="px-6 py-2 w-full font-semibold text-xl text-white bg-green-500 rounded-md hover:bg-green-600 transition-all duration-200 focus:outline-none"
                        >
                            Edit
                        </button>
                    )}
                </div>
        </motion.div>
        </div>
    );
};

export default ManageRestaurant;