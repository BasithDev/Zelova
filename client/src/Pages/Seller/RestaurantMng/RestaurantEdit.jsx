import PropTypes from "prop-types";
import { AnimatePresence, motion } from 'framer-motion';
import { MdEdit } from 'react-icons/md';
import { FaStar, FaPhoneAlt } from 'react-icons/fa';
import InputField from '../../../Components/InputField';
import { useState, useEffect } from "react";
import { openOrCloseShop, updateRestaurantPic } from "../../../Services/apiServices";
import { IoIosCloseCircle } from "react-icons/io";
import { uploadImageToCloud } from "../../../Helpers/uploadImageToCloud";
import {BeatLoader,ClipLoader} from 'react-spinners'
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchRestaurantData } from "../../../Redux/slices/seller/restaurantDataSlice";

const RestaurantEdit = ({
    restaurantDetails,
    isEditing,
    handleFieldChange,
    saveChanges,
    setIsEditing,
    detailFields,
}) => {
    const [isOpen, setIsOpen] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isImageUpdating,setIsImageUpdating] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageLoaded,setIsImageLoaded] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        if (restaurantDetails && typeof restaurantDetails.isActive === "boolean") {
            setIsOpen(restaurantDetails.isActive);
        }
    }, [restaurantDetails]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const extractPublicId = (url) => {
        const regex = /\/v(\d+)\/(.*)\./;
        const match = url.match(regex);
        if (match) {
          return match[2];
        }
        return null;
      };

    const handleUpdateImage = async () => {
        try {
            if (!selectedImage) {
                toast.info("Please select an image before updating.")
                return;
            }
            setIsImageUpdating(true)
            const cloudResponse = await uploadImageToCloud(selectedImage);
            if (cloudResponse) {
                const public_id = extractPublicId(restaurantDetails.image)
                const imageURL = cloudResponse.secure_url
                await updateRestaurantPic(restaurantDetails.vendorId, {imageURL,public_id});
                toast.success("Image updated successfully!")
                setShowPopup(false);
                dispatch(fetchRestaurantData(restaurantDetails.vendorId))
            } else {
                throw new Error("Failed to upload image.");
            }
        } catch (error) {
            console.error("Error updating image:", error);
            toast.error("Error updating image. Please try again.")
        } finally {
            setIsImageUpdating(false)
        }
    };

    const toggleShopStatus = async () => {
        try {
            setLoading(true);
            const updatedStatus = !isOpen;
            await openOrCloseShop(restaurantDetails.vendorId, updatedStatus);
            setIsOpen(updatedStatus);
            dispatch(fetchRestaurantData(restaurantDetails.vendorId))
        } catch (error) {
            console.error("Error updating shop status:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <motion.div
                className="flex relative flex-col md:flex-row max-w-6xl mx-auto rounded-lg shadow-2xl overflow-hidden p-3 bg-slate-100 mb-8"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
                <div className="relative rounded-lg w-fit h-96 md:h-auto group">
                {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <ClipLoader color="#22c55e" size={40} />
                </div>
            )}
                    <img
                        src={restaurantDetails.image}
                        alt="Restaurant"
                        loading="lazy"
                        className=" object-contain h-80 rounded-lg shadow-xl"
                        onLoad={() => setIsImageLoaded(true)}
                    />
                    <MdEdit
                        onClick={() => setShowPopup(true)}
                        className="absolute bottom-2 right-2 flex items-center text-3xl bg-green-500 hover:bg-green-600 bg-opacity-80 cursor-pointer p-1 justify-center text-white hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full"
                    />
                </div>

                <motion.button
                    onClick={toggleShopStatus}
                    className={`absolute top-4 right-4 px-3 py-1 text-xl font-semibold rounded-md text-white ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {loading ? <BeatLoader color="white" size={10}/> : isOpen ? "Open" : "Closed"}
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
                    onClick={() => (isEditing ? saveChanges() : setIsEditing(true))}
                    className="mt-6 px-6 py-2 text-xl font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                    {isEditing ? "Save" : "Edit"}
                </button>
            </motion.div>
            <AnimatePresence>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div 
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white relative p-4 rounded shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Edit Profile Picture</h3>
                        <IoIosCloseCircle
                            onClick={() => setShowPopup(false)}
                            className="absolute top-2 right-2 bg-red-500 text-white text-xl cursor-pointer rounded-full hover:bg-red-600"
                        />
                        <img
                            src={selectedImage ? URL.createObjectURL(selectedImage) : restaurantDetails.image}
                            alt="Selected"
                            className="w-full h-full object-contain rounded mb-4"
                        />
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => document.getElementById('imageInput').click()}
                                className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600"
                            >
                                Select
                            </button>
                            <button
                                onClick={handleUpdateImage}
                                className="bg-green-500 px-4 py-2 text-white rounded hover:bg-green-600"
                            >
                                {isImageUpdating ? <BeatLoader color="white" size={10}/> : 'Update'}
                            </button>
                        </div>
                        <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                    </motion.div>
                </div>
            )}
            </AnimatePresence>
        </div>
    );
};

RestaurantEdit.propTypes = {
    restaurantDetails: PropTypes.shape({
        vendorId: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string,
        phone: PropTypes.string,
        openingTime: PropTypes.string,
        closingTime: PropTypes.string,
        image: PropTypes.string,
        isActive: PropTypes.bool
    }).isRequired,
    isOpen: PropTypes.bool,
    toggleShopStatus: PropTypes.func,
    isEditing: PropTypes.bool.isRequired,
    handleFieldChange: PropTypes.func.isRequired,
    saveChanges: PropTypes.func.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    detailFields: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default RestaurantEdit;