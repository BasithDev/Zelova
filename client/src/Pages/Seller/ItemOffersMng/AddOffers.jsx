import { toast } from 'react-toastify';
import { addOffer,getOffers,deleteOffer } from '../../../Services/apiServices';
import { useState,useEffect,useCallback } from "react";
import PrimaryBtn from '../../../Components/Buttons/PrimaryBtn';

const AddOffers = () => {
    const [offerName, setOfferName] = useState('');
    const [requiredQuantity, setRequiredQuantity] = useState('');
    const [discountAmount, setDiscountAmount] = useState('');
    const [offers, setOffers] = useState([]);

    const fetchOffers = useCallback(async () => {
        try {
            const response = await getOffers();
            setOffers(response.data.offers);
        } catch (error) {
            console.error('Error fetching offers:', error);
            toast.error('Failed to fetch offers. Please try again.');
        }
    },[]);

    useEffect(() => {
        fetchOffers()
    }, [fetchOffers]);

    const handleAddOffer = async () => {
        if (!offerName || !requiredQuantity || !discountAmount) {
            toast.error('All fields are required!');
            return;
        }
        if (requiredQuantity <= 0 || discountAmount < 0) {
            toast.error('Invalid quantity or discount amount!');
            return;
        }
        try {
            const offerData = { offerName, requiredQuantity, discountAmount };
            await addOffer(offerData);
            toast.success('Offer added successfully!');
            setOfferName('');
            setRequiredQuantity('');
            setDiscountAmount('');
            fetchOffers();
            window.dispatchEvent(new Event('updateDropdownData'));
        } catch (error) {
            console.error('Error adding offer:', error);
            toast.error('Failed to add offer. Please try again.');
        }
    };

    const handleDeleteOffer = async (offerId) => {
        try {
            const response = await deleteOffer(offerId);
            toast.success(response.data.message);
            fetchOffers();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-8 max-w-5xl mx-auto space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">Offer Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col space-y-2 sm:space-y-3">
                    <label className="text-base sm:text-lg font-medium text-gray-700">Offer Name</label>
                    <input
                        type="text"
                        className="text-base sm:text-xl p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter offer name"
                        value={offerName}
                        onChange={(e) => setOfferName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col space-y-2 sm:space-y-3">
                    <label className="text-base sm:text-lg font-medium text-gray-700">Required Quantity</label>
                    <input
                        type="number"
                        className="text-base sm:text-xl p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter required quantity"
                        value={requiredQuantity}
                        onChange={(e) => setRequiredQuantity(e.target.value)}
                    />
                </div>
                <div className="flex flex-col space-y-2 sm:space-y-3">
                    <label className="text-base sm:text-lg font-medium text-gray-700">Discount Amount</label>
                    <input
                        type="number"
                        className="text-base sm:text-xl p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter discount amount"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                    />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <PrimaryBtn
                        text="Add Offer"
                        onClick={handleAddOffer}
                        className="w-full py-2 sm:py-3 px-4 sm:px-6 text-base sm:text-xl font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
                    />
                </div>
            </div>

            <div className="mt-6 sm:mt-8">
                <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Available Offers</h3>
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md space-y-3 sm:space-y-4">
                    {offers.length > 0 ? (
                        offers.map((offer) => (
                            <div
                                key={offer._id}
                                className="flex hover:scale-[1.02] cursor-pointer hover:shadow-lg transition-all duration-200 justify-between items-center p-3 sm:p-4 bg-white rounded-lg shadow"
                            >
                                <div>
                                    <h4 className="text-base sm:text-xl font-semibold text-gray-800">{offer.offerName}</h4>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        Quantity: {offer.requiredQuantity} | Discount: {offer.discountAmount}%
                                    </p>
                                </div>
                                <button
                                    className="text-red-500 text-sm sm:text-lg font-semibold hover:text-white hover:bg-red-500 transition-all duration-200 px-2 py-1 rounded-md"
                                    onClick={() => handleDeleteOffer(offer._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-base sm:text-lg text-gray-600">No offers available.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddOffers