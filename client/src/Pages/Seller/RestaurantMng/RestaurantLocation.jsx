import PropTypes from "prop-types";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import Map from "../../../Components/Map/Map";
import InputField from "../../../Components/InputField";
import { setLocation } from "../../../Services/apiServices";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantData } from "../../../Redux/slices/seller/restaurantDataSlice";
const RestaurantLocation = ({ restaurantDetails, setRestaurantDetails, coordinates, setCoordinates }) => {
    const dispatch = useDispatch();
    const restaurantData = useSelector((state) => state.restaurantData.data?.restaurant);
    const [isLoadingUpdating, setIsLocationUpdating] = useState(false);

    const handleFieldChange = (field, value) => {
        setRestaurantDetails((prev) => ({ ...prev, [field]: value }));
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async ({ coords: { latitude, longitude } }) => {
                setCoordinates({ lat: latitude, lng: longitude });
                console.log(coordinates)
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GMAP_KEY}`
                );
                const data = await response.json();
                if (data.results?.[0]) {
                    handleFieldChange("address", data.results[0].formatted_address);
                }
                toast.success('Got Current Location')
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleLocationSelect = (address, lat, lng) => {
        handleFieldChange("address", address);
        setCoordinates({ lat, lng });
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
            await setLocation(restaurantDetails.vendorId, {
                address: restaurantDetails.address,
                coordinates,
            });
            dispatch(fetchRestaurantData(restaurantData.vendorId));
            toast.success("Location updated successfully!");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update location. Please try again.");
        } finally {
            setIsLocationUpdating(false);
        }
    };
  return (
    <div className="flex flex-col max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6 mt-6">
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
                <Tooltip id="location-tooltip" />
            </div>

            <Map lat={coordinates.lat} lng={coordinates.lng} onLocationSelect={handleLocationSelect} />
            <button
                className="mt-6 px-6 py-2 text-xl font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                onClick={handleSaveLocation}
                disabled={isLoadingUpdating}
            >
                {isLoadingUpdating ? <BeatLoader color="white" size={10} /> : "Save"}
            </button>
        </div>
  )
}
RestaurantLocation.propTypes = {
    restaurantDetails: PropTypes.shape({
        address: PropTypes.string,
        vendorId: PropTypes.string,
    }),
    setRestaurantDetails: PropTypes.func,
    coordinates: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }),
    setCoordinates: PropTypes.func,
};
export default RestaurantLocation