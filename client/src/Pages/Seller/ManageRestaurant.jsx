import { useState, useEffect, useMemo } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import RestaurantLocation from './RestaurantMng/RestaurantLocation';
import { updateRestaurantDetails } from '../../Services/apiServices';
import { fetchRestaurantData } from '../../Redux/slices/seller/restaurantDataSlice';
import RestaurantEdit from './RestaurantMng/RestaurantEdit';


const ManageRestaurant = () => {
    const restaurantData = useSelector((state) => state.restaurantData.data?.restaurant);
    const [isEditing, setIsEditing] = useState(false);
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const dispatch = useDispatch()
    const defaultDetails = useMemo(
        () => ({
            name: "No name",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
            address: "Add Address",
            phone: "Add Phone Number",
            openingTime: "09:00",
            closingTime: "21:00",
            photoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9oBl8oMj8unCKsHx9WuzVKgxc34HJnei-Qw&s",
        }),
        []
    );
    const [restaurantDetails, setRestaurantDetails] = useState(defaultDetails);

    useEffect(() => {
        if (restaurantData) {
            setRestaurantDetails({ ...defaultDetails, ...restaurantData });
            const [lat = 0, lng = 0] = restaurantData?.location?.coordinates || [];
            setCoordinates({ lat, lng });
        }
    }, [defaultDetails, restaurantData]);

    const saveChanges = async () => {
        const keysToCompare = [
            "name",
            "description",
            "address",
            "phone",
            "openingTime",
            "closingTime",
            "location",
        ];
    
        const hasChanges = keysToCompare.some((key) => {
            return restaurantData[key] !== restaurantDetails[key];
        });

        if (!hasChanges) {
            toast.info('No changes detected!');
            setIsEditing(false)
            return;
        }

        try {
            await updateRestaurantDetails(restaurantDetails);
            toast.success('Restaurant details updated successfully!');
            dispatch(fetchRestaurantData())
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while updating restaurant details!');
        } finally{
            setIsEditing(false)
        }

    };

    const handleFieldChange = (field, value) => {
        setRestaurantDetails((prev) => ({ ...prev, [field]: value }));
    };
    

    const detailFields = {
        "Restaurant Name": "name",
        Description: "description",
        "Phone Number": "phone",
        "Opening Time": "openingTime",
        "Closing Time": "closingTime",
    };
    
    return (
        <div className="container mx-auto px-4 py-6 sm:py-10">
            <ToastContainer position="top-right" />
            <h1 className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-8">Manage Restaurant</h1>

            <RestaurantEdit
                restaurantDetails={restaurantDetails}
                isEditing={isEditing}
                handleFieldChange={handleFieldChange}
                saveChanges={saveChanges}
                setIsEditing={setIsEditing}
                detailFields={detailFields}
            />
            <RestaurantLocation
                restaurantDetails={restaurantDetails}
                setRestaurantDetails={setRestaurantDetails}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
            />
        </div>
    );
};

export default ManageRestaurant;