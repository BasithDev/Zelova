import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "16px"
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

    if (loadError) return <div className="text-red-500 text-center p-4">Error loading map</div>;
    if (!isLoaded) return <div className="flex justify-center items-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;

    return (
        <div className="map-container w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] rounded-2xl bg-slate-50 p-2 sm:p-4 shadow-lg">
            <div className="relative w-full h-full">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={currentPosition}
                    zoom={15}
                    onClick={handleMapClick}
                    onLoad={handleOnLoad}
                    options={{
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                    }}
                >
                    <MarkerF position={currentPosition} />
                </GoogleMap>
            </div>
        </div>
    );
};

Map.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    onLocationSelect: PropTypes.func.isRequired,
};

export default Map;