import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState , useRef } from 'react';
import PropTypes from 'prop-types';
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";
import { AnimatePresence, motion } from 'framer-motion';

const fetchVendorApplications = async () => {
    const { data } = await axios.get("http://localhost:3000/api/admin/manage/requests");
    return data;
};

const Requests = () => {
    const { data: applications, isLoading, isError } = useQuery({
        queryKey: ['vendorApplications'],
        queryFn: fetchVendorApplications,
        staleTime: 60000,
        cacheTime: 300000,
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading vendor requests</p>;

    return (
        <div className="pb-3 bg-gray-100 min-h-screen transition-all duration-300">
            <AdminSearchBar />
            <h1 className="text-2xl mx-3 font-bold mb-4">Vendors Request</h1>
            <div className="space-y-4">
                {applications && applications.length > 0 ? (
                    applications.map((application) => (
                        <VendorApplicationCard key={application._id} application={application} />
                    ))
                ) : (
                    <p className="text-center">No vendor applications available.</p>
                )}
            </div>
        </div>
    );
};

const VendorApplicationCard = ({ application }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDetails = () => setIsExpanded(!isExpanded);

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white mx-3 p-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 flex flex-col items-start"
        >
            <div className="flex items-center">
                <img src={application.user.profilePhoto || "https://placehold.co/60x60"} alt={`Profile of ${application.user.fullname}`} className="w-16 h-16 rounded-full mr-4 border border-gray-300 shadow-sm" />
                <div className="flex-1">
                    <h2 className="text-xl font-semibold">{application.user.fullname}</h2>
                    <p className="text-gray-600">{application.restaurantName}</p>
                    <p className="text-gray-600">{application.user.email}</p>
                </div>
            </div>
            <div className="flex space-x-2 mt-4">
                <button
                    onClick={toggleDetails}
                    className="font-semibold text-lg transition-all duration-300 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transform hover:scale-105"
                >
                    {isExpanded ? "Close" : "View"}
                </button>
                <button className="font-semibold text-lg transition-all duration-300 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transform hover:scale-105">
                    Accept
                </button>
                <button className="font-semibold text-lg transition-all duration-300 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transform hover:scale-105">
                    Deny
                </button>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 bg-gray-100 rounded-md shadow-xl p-4 w-full border-t border-gray-200"
                    >
                        <p><strong>License</strong></p>
                        <ImageZoom src={application.license} alt="License Image" />
                        <p><strong>Restaurant Name:</strong> {application.restaurantName}</p>
                        <p><strong>Address:</strong> {application.address}</p>
                        <p><strong>Description:</strong> {application.description}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
VendorApplicationCard.propTypes = {
    application: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        restaurantName: PropTypes.string.isRequired,
        description: PropTypes.string,
        address: PropTypes.string,
        license: PropTypes.string.isRequired,
        user: PropTypes.shape({
            profilePhoto: PropTypes.string,
            fullname: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};
const ImageZoom = ({ src, alt }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
    const imageRef = useRef(null);

    const handleMouseEnter = () => setIsZoomed(true);
    const handleMouseLeave = () => setIsZoomed(false);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setBackgroundPosition(`${x}% ${y}%`);
    };

    return (
        <div className="flex bg-white p-3 w-fit rounded-2xl space-x-4">
            <div
                className="relative w-60 h-60 overflow-hidden border border-gray-300 rounded-lg"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                ref={imageRef}
            >
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            </div>
            {isZoomed && (
                <div
                    className="w-60 h-60 border border-gray-300 rounded-lg shadow-lg overflow-hidden"
                    style={{
                        backgroundImage: `url(${src})`,
                        backgroundSize: "200%",
                        backgroundPosition,
                    }}
                ></div>
            )}
        </div>
    );
};

ImageZoom.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
};

export default Requests;