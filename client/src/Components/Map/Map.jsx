import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

function useLoadGoogleMaps(callback) {
    useEffect(() => {
        const scriptId = "google-maps-script";

        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GMAP_KEY}&loading=async&libraries=marker`;
            script.id = scriptId;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                if (callback) callback();
            };

            script.onerror = () => {
                console.error("Failed to load the Google Maps script");
            };

            document.body.appendChild(script);
        } else if (callback) {
            callback();
        }
    }, [callback]);
}

const Map = ({ lat, lng, onLocationSelect }) => {
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useLoadGoogleMaps(() => {
        setIsMapLoaded(true);
    });

    const mapRef = useRef(null);
    const googleMapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (mapRef.current && isMapLoaded && window.google && !googleMapRef.current) {
            googleMapRef.current = new window.google.maps.Map(mapRef.current, {
                center: { lat, lng },
                zoom: 14,
            });

            markerRef.current = new window.google.maps.Marker({
                position: { lat, lng },
                map: googleMapRef.current,
                title: "Current Location",
            });

            googleMapRef.current.addListener("click", async (event) => {
                const { latLng } = event;
                const clickedLat = latLng.lat();
                const clickedLng = latLng.lng();
            
                markerRef.current.setPosition({ lat: clickedLat, lng: clickedLng });
            
                try {
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${clickedLat},${clickedLng}&key=${import.meta.env.VITE_GMAP_KEY}`
                    );
            
                    if (!response.ok) throw new Error("Failed to fetch geocoding data");
            
                    const data = await response.json();
                    if (data.results?.[0]) {
                        const clickedAddress = data.results[0].formatted_address;
                        onLocationSelect(clickedAddress, clickedLat, clickedLng);
                    }
                } catch (error) {
                    console.error("Error fetching geocoding data:", error);
                }
            });
            
        }
    }, [isMapLoaded, lat, lng, onLocationSelect]);

    useEffect(() => {
        if (googleMapRef.current && markerRef.current) {
            googleMapRef.current.setCenter({ lat, lng });
            markerRef.current.setPosition({ lat, lng });
        }
    }, [lat, lng]);

    // Render a loading state until the map is loaded
    if (!isMapLoaded) {
        return <div className="w-full h-80 mt-6 bg-gray-200 rounded-md flex items-center justify-center">Loading map...</div>;
    }

    return <div ref={mapRef} className="w-full h-80 mt-6 bg-gray-200 rounded-md"></div>;
};

// Default prop values
Map.defaultProps = {
    lat: 0, // Default latitude
    lng: 0, // Default longitude
};

// Prop types validation
Map.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    onLocationSelect: PropTypes.func.isRequired,
};

export default Map;
