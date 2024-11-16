import {  useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
const Map = ({ lat, lng, onLocationSelect }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (lat && lng && mapRef.current) {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat, lng },
                zoom: 14,
            });
            const marker = new window.google.maps.Marker({
                position: { lat, lng },
                map,
                title: "Current Location",
            });

            map.addListener("click", async (event) => {
                const { latLng } = event;
                const clickedLat = latLng.lat();
                const clickedLng = latLng.lng();
                marker.setPosition({ lat: clickedLat, lng: clickedLng });
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${clickedLat},${clickedLng}&key=${import.meta.env.VITE_GMAP_KEY}`
                );
                const data = await response.json();
                if (data.results?.[0]) {
                    const clickedAddress = data.results[0].formatted_address;
                    onLocationSelect(clickedAddress, clickedLat, clickedLng);
                }
            });
        }
    }, [lat, lng, onLocationSelect]);

    return <div ref={mapRef} className="w-full h-80 mt-6 bg-gray-200 rounded-md"></div>;
};

Map.propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
    onLocationSelect: PropTypes.func.isRequired,
};
export default Map