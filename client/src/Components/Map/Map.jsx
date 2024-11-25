import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px",
    boxShadow: "0px 0px 8px",
    borderRadius: "24px"
};

const Map = ({ lat, lng, onLocationSelect }) => {
    const [currentPosition, setCurrentPosition] = useState({ lat, lng });
    const mapRef = useRef(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GMAP_KEY,
    });

    const fetchAddress = useCallback(async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GMAP_KEY}`
            );
            const data = await response.json();
            if (data.results?.[0]) {
                const address = data.results[0].formatted_address;
                onLocationSelect(address, latitude, longitude);
            } else {
                throw new Error("No address found");
            }
        } catch (error) {
            console.error("Failed to fetch address:", error);
        }
    }, [onLocationSelect]);

    const handleMapClick = (event) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        setCurrentPosition({ lat: newLat, lng: newLng });
        fetchAddress(newLat, newLng);
    };

    const handleOnLoad = (map) => {
        mapRef.current = map;
    };

    useEffect(() => {
        setCurrentPosition({ lat, lng });
    }, [lat, lng]);

    if (loadError) return <p>Error loading map</p>;
    if (!isLoaded) return <p>Loading...</p>;

    return (
        <div className="map-container mt-6 shadow-xl rounded-2xl bg-blue-100 p-4">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={15}
                onClick={handleMapClick}
                onLoad={handleOnLoad}
            >
                <MarkerF position={currentPosition} />
            </GoogleMap>
        </div>
    );
};

Map.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    onLocationSelect: PropTypes.func.isRequired,
};

export default Map;