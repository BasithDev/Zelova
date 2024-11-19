import PrimaryBtn from '../../Components/Buttons/PrimaryBtn';
import { useState,useEffect,useCallback } from "react";
import { toast } from 'react-toastify';
import { addOffer,getOffers,deleteOffer } from '../../Services/apiServices';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddFoodCategories from './AddFoodCategories'
import { useSelector } from 'react-redux';

const AddOffers = () => {
    const [offerName, setOfferName] = useState('');
    const [requiredQuantity, setRequiredQuantity] = useState('');
    const [discountAmount, setDiscountAmount] = useState('');
    const [restaurantId, setRestaurantId] = useState('');
    const [offers, setOffers] = useState([]);

    const id = useSelector((state)=>state.restaurantData.data?.restaurant?._id)

    useEffect(()=>{
        if (id) setRestaurantId(id)
    },[id])

    const fetchOffers = useCallback(async () => {
        try {
            const response = await getOffers(restaurantId);
            setOffers(response.data.offers);
        } catch (error) {
            console.error('Error fetching offers:', error);
            toast.error('Failed to fetch offers. Please try again.');
        }
    },[restaurantId]);

    useEffect(() => {
        if (restaurantId) {
            fetchOffers();
        }
    }, [fetchOffers, restaurantId]);

    const handleAddOffer = async () => {
        if (!offerName || !requiredQuantity || !discountAmount || !restaurantId) {
            toast.error('All fields are required!');
            return;
        }
        if (requiredQuantity <= 0 || discountAmount < 0) {
            toast.error('Invalid quantity or discount amount!');
            return;
        }
        try {
            const offerData = { offerName, requiredQuantity, discountAmount, restaurantId };
            await addOffer(offerData);
            toast.success('Offer added successfully!');
            setOfferName('');
            setRequiredQuantity('');
            setDiscountAmount('');
            fetchOffers();
        } catch (error) {
            console.error('Error adding offer:', error);
            toast.error('Failed to add offer. Please try again.');
        }
    };

    const handleDeleteOffer = async (offerId) => {
        try {
            const response = await deleteOffer(offerId);
            toast.success(response.message);
            fetchOffers();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Offer Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700 mb-2">Offer Name</label>
                    <input
                        type="text"
                        className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter offer name"
                        value={offerName}
                        onChange={(e) => setOfferName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700 mb-2">Required Quantity</label>
                    <input
                        type="number"
                        className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter required quantity"
                        value={requiredQuantity}
                        onChange={(e) => setRequiredQuantity(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700 mb-2">Discount Amount</label>
                    <input
                        type="number"
                        className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter discount amount"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                    />
                </div>
                <div className="col-span-2">
                    <PrimaryBtn
                        text="Add Offer"
                        onClick={handleAddOffer}
                        className="w-full px-6 py-3 text-xl font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
                    />
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Available Offers</h3>
                <div className="bg-gray-50 p-4 rounded-lg shadow-md space-y-4">
                {offers.length > 0 ? (
                        offers.map((offer) => (
                            <div
                                key={offer._id}
                                className="flex justify-between items-center p-4 bg-white rounded-lg shadow"
                            >
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-800">{offer.offerName}</h4>
                                    <p className="text-gray-600">
                                        Quantity: {offer.requiredQuantity} | Discount: {offer.discountAmount}%
                                    </p>
                                </div>
                                <button
                                    className="text-red-500 text-lg font-semibold hover:text-white hover:bg-red-500 transition-all duration-200 px-2 py-1 rounded-md"
                                    onClick={() => handleDeleteOffer(offer._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No offers available.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

const AddItem = () => {
    const [isCustomizable, setIsCustomizable] = useState(false);
    const [customFields, setCustomFields] = useState([]);

    const handleCustomizationChange = (e) => {
        setIsCustomizable(e.target.value === "Yes");
        if (e.target.value === "No") {
            setCustomFields([]);  // Clear custom fields when 'No' is selected
        }
    };

    const addCustomField = () => {
        setCustomFields([...customFields, { fieldName: "", options: "" }]);
    };

    const removeCustomField = (index) => {
        const newFields = customFields.filter((_, i) => i !== index);
        setCustomFields(newFields);
    };

    const handleFieldChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFields = customFields.map((field, i) =>
            i === index ? { ...field, [name]: value } : field
        );
        setCustomFields(updatedFields);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <ToastContainer position="top-right" />
            <div className="space-y-8">
                <AddFoodCategories />
                <AddOffers />
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto space-y-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Add New Food Item</h3>
                    <form className="space-y-8">
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Select Food Item Category</label>
                            <select
                                className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Select a category</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Item Name</label>
                            <input
                                type="text"
                                className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter item name"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Add Item Images</label>
                            <div className="flex space-x-4 mt-4">
                                <div className="w-32 h-32 border border-gray-300 rounded-md flex items-center justify-center text-2xl text-gray-400 cursor-pointer">
                                    <input type="file" className="hidden" id="image-upload" />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        +
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Item Price</label>
                            <input
                                type="text"
                                className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter item price"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Select Offer Type</label>
                            <select
                                className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Select an offer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Item Description</label>
                            <textarea
                                className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                rows="4"
                                placeholder="Enter item description"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Customizable</label>
                            <select
                                className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                onChange={handleCustomizationChange}
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>

                        {isCustomizable && (
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">Custom Fields</label>
                                <div className="space-y-6">
                                    {customFields.map((field, index) => (
                                        <div key={index} className="space-y-4">
                                            <div>
                                                <label className="block text-lg font-medium text-gray-700 mb-2">Custom Choice Name</label>
                                                <input
                                                    type="text"
                                                    name="fieldName"
                                                    value={field.fieldName}
                                                    onChange={(e) => handleFieldChange(index, e)}
                                                    className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    placeholder="Enter custom field name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-lg font-medium text-gray-700 mb-2">Custom Choice Options</label>
                                                <input
                                                    type="text"
                                                    name="options"
                                                    value={field.options}
                                                    onChange={(e) => handleFieldChange(index, e)}
                                                    className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    placeholder="Enter options separated by commas"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-lg font-medium text-gray-700 mb-2">Custom Choice Price</label>
                                                <input
                                                    type="text"
                                                    name="options"
                                                    value={field.options}
                                                    onChange={(e) => handleFieldChange(index, e)}
                                                    className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    placeholder="Enter options separated by commas"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeCustomField(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove Custom Field
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addCustomField}
                                        className="py-2 px-4 text-white bg-green-500 rounded-md hover:bg-green-600"
                                    >
                                        Add Custom Field
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <PrimaryBtn
                                text="Add Item"
                                onClick={() => console.log('Item Added')}
                                className="py-3 px-8 text-xl font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddItem;