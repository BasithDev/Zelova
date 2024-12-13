import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import Map from "../../../Components/Map/Map";
import InputField from "../../../Components/Common/InputField";
import { setLocation } from "../../../Services/apiServices";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantData } from "../../../Redux/slices/seller/restaurantDataSlice";

const RestaurantLocation = ({
    restaurantDetails,
    setRestaurantDetails,
    coordinates = { lat: 0, lng: 0 },
    setCoordinates,
}) => {
    const dispatch = useDispatch();
    const restaurantData = useSelector((state) => state.restaurantData.data?.restaurant);
    const [isLocationUpdating, setIsLocationUpdating] = useState(false);

    const handleFieldChange = useCallback(
        (field, value) => {
            setRestaurantDetails((prev) => ({ ...prev, [field]: value }));
        },
        [setRestaurantDetails]
    );

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => {
                    setCoordinates({ lat: latitude, lng: longitude });
                    toast.success("Current location detected successfully!");
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    toast.error("Failed to fetch current location. Please enable location access.");
                },
                { enableHighAccuracy: true }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
        }
    };

    const fetchAddressFromCoordinates = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GMAP_KEY}`
            );
            const data = await response.json();
            if (data.results?.[0]) {
                return data.results[0].formatted_address;
            }
            throw new Error("No address found for the given coordinates.");
        } catch (error) {
            console.error("Failed to fetch address:", error);
            toast.error("Failed to fetch address. Try again later.");
            return null;
        }
    };

    const handleSaveLocation = async () => {
        const [prevLat, prevLng] = restaurantData?.location?.coordinates || [];
        const prevAddress = restaurantData?.address;

        if (
            coordinates.lat === prevLat &&
            coordinates.lng === prevLng &&
            restaurantDetails.address === prevAddress
        ) {
            toast.info("Location not changed, no update required.");
            return;
        }

        setIsLocationUpdating(true);
        try {
            await setLocation({
                address: restaurantDetails.address,
                coordinates,
            });
            dispatch(fetchRestaurantData());
            toast.success("Location updated successfully!");
        } catch (error) {
            console.error("Error updating location:", error);
            toast.error("Failed to update location. Please try again.");
        } finally {
            setIsLocationUpdating(false);
        }
    };

    useEffect(() => {
        if (coordinates.lat && coordinates.lng) {
            const updateAddress = async () => {
                const address = await fetchAddressFromCoordinates(coordinates.lat, coordinates.lng);
                if (address) handleFieldChange("address", address);
            };
            updateAddress();
        }
    }, [coordinates, handleFieldChange]);

    return (
        <div className="flex flex-col max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-4 sm:p-6 mt-4 sm:mt-6">
            <h2 className="text-xl sm:text-3xl font-semibold mb-3 sm:mb-4">Restaurant Location</h2>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
                <div className="flex-grow">
                    <InputField
                        label="Address"
                        value={restaurantDetails.address || ""}
                        onChange={(e) => handleFieldChange("address", e.target.value)}
                        isEditable
                    />
                </div>
                <button
                    data-tooltip-id="location-tooltip"
                    data-tooltip-content="Click here to get your current address and pin location on the map"
                    onClick={getCurrentLocation}
                    className="w-full sm:w-auto py-2 px-4 sm:px-6 bg-blue-500 text-base sm:text-xl font-semibold text-white rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap h-[42px]"
                >
                    Detect Location
                </button>
                <Tooltip id="location-tooltip" />
            </div>
            <div className="mt-4 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full">
                <Map
                    lat={coordinates?.lat}
                    lng={coordinates?.lng}
                    onLocationSelect={(address, lat, lng) => {
                        handleFieldChange("address", address);
                        setCoordinates({ lat, lng });
                    }}
                />
            </div>
            <button
                className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 text-base sm:text-xl font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                onClick={handleSaveLocation}
                disabled={isLocationUpdating}
                aria-disabled={isLocationUpdating}
            >
                {isLocationUpdating ? <BeatLoader color="white" size={8} /> : "Save"}
            </button>
        </div>
    );
};

RestaurantLocation.propTypes = {
    restaurantDetails: PropTypes.shape({
        address: PropTypes.string,
        vendorId: PropTypes.string,
    }).isRequired,
    setRestaurantDetails: PropTypes.func.isRequired,
    coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }),
    setCoordinates: PropTypes.func.isRequired,
};

export default RestaurantLocation;