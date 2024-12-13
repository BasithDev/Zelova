import PrimaryBtn from '../../Components/Buttons/PrimaryBtn';
import { useState, useRef, useEffect, useCallback } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { AnimatePresence, motion } from 'framer-motion';
import AddFoodCategories from './ItemOffersMng/AddFoodCategories';
import AddOffers from './ItemOffersMng/AddOffers';
import { addProduct, getOffers, getSubCategories } from '../../Services/apiServices';
import { MdEdit } from 'react-icons/md';
import FormField from './ItemOffersMng/FormField';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { toast } from "react-toastify";
import { uploadImageToCloud } from '../../Helpers/uploadImageToCloud';
import { BeatLoader } from 'react-spinners';

const AddItem = () => {
    const [formData, setFormData] = useState({
        itemName: '',
        price: '',
        description: '',
        category: '',
        offer: '',
        isCustomizable: false,
        customFields: [],
        image: null,
    });

    const [croppedImage,setCroppedImage] = useState(null)
    const [isAddingItem,setIsAddingItem] = useState(false)

    const [dropdownData, setDropdownData] = useState({ subCategories: [], offers: [] });
    const [isCropperVisible, setIsCropperVisible] = useState(false);
    const cropperRef = useRef(null);

    const fetchDropdownData = useCallback(async () => {
        try {
            const [subCategoriesResponse, offersResponse] = await Promise.all([getSubCategories(), getOffers()]);
            setDropdownData({
                subCategories: subCategoriesResponse.data.subCategories || [],
                offers: offersResponse.data.offers || [],
            });
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    }, []);

    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);

    useEffect(() => {
        const handleUpdate = () => {
            fetchDropdownData();
        };
    
        window.addEventListener('updateDropdownData', handleUpdate);
    
        return () => {
            window.removeEventListener('updateDropdownData', handleUpdate);
        };
    }, [fetchDropdownData]);
    

    const handleFieldChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCustomizationChange = (value) => {
        handleFieldChange('isCustomizable', value === 'Yes');
        if (value === 'No') {
            handleFieldChange('customFields', []);
        }
    };

    const addCustomField = () => {
        setFormData((prev) => ({
            ...prev,
            customFields: [...prev.customFields, { fieldName: '', options: '', price: '' }],
        }));
    };

    const updateCustomField = (index, field, value) => {
        const updatedFields = formData.customFields.map((f, i) =>
            i === index ? { ...f, [field]: value } : f
        );
        handleFieldChange('customFields', updatedFields);
    };

    const removeCustomField = (index) => {
        const updatedFields = formData.customFields.filter((_, i) => i !== index);
        handleFieldChange('customFields', updatedFields);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleFieldChange('image', reader.result);
                setIsCropperVisible(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelectNewImage = () => {
        setIsCropperVisible(false);
        handleFieldChange('image', null);
        setCroppedImage(null)
    };

    const handleDoneCrop = () => {
        if (cropperRef.current) {
            const croppedData = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
            setCroppedImage(croppedData)
            setIsCropperVisible(false);
        }
    };

    const validateForm = () => {
        const { itemName, price, category,customFields } = formData;
        if (!itemName || !price || !category || !croppedImage) {
            toast.error('Please fill in all required fields!');
            return false;
        }
        if (customFields && customFields.length > 0) {
            for (let field of customFields) {
                const { fieldName, options, price } = field;
    
                if (!fieldName || !options || !price) {
                    toast.error(`Custom field "${fieldName || 'Unnamed'}" is incomplete!`);
                    return false;
                }
    
                const optionsArray = options.split(',');
                const priceArray = price.split(',');
    
                if (optionsArray.length !== priceArray.length) {
                    toast.error(`Custom field "${fieldName}" has mismatched options and prices!`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                setIsAddingItem(true)
                const uploadedImage = await uploadImageToCloud(croppedImage)
                const updatedFormData = { ...formData, image: uploadedImage.secure_url };
                const response = await addProduct(updatedFormData)
                toast.success(response.data.message)
                setFormData({
                    itemName: '',
                    price: '',
                    description: '',
                    category: '',
                    offer: '',
                    isCustomizable: false,
                    customFields: [],
                    image: null,
                })
                setCroppedImage(null)
            } catch (error) {
                toast.error('Failed to add product!');
                console.error('Add Product Error:', error);
            } finally {
                setIsAddingItem(false)
            }
        }
    };

    const { subCategories, offers } = dropdownData;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="space-y-8">
                <h1 className='text-center font-bold text-5xl'>Add Items</h1>
                <AddFoodCategories />
                <AddOffers />
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto space-y-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Add New Food Item</h3>
                    <form className="space-y-8">
                        <FormField
                            label="Item Name"
                            placeholder="Enter item name"
                            value={formData.itemName}
                            onChange={(e) => handleFieldChange('itemName', e.target.value)}
                        />
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Add Item Images</label>
                            <div className="flex space-x-4 mt-4">
                                {croppedImage ? (
                                    <div className="relative w-52 h-60 border border-gray-300 rounded-md flex items-center justify-center group">
                                        <img
                                            src={croppedImage}
                                            alt="Cropped"
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                        <MdEdit
                                            onClick={() => document.getElementById('image-upload').click()}
                                            className="cursor-pointer text-4xl p-1 bottom-2 right-2 text-white absolute rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => document.getElementById('image-upload').click()}
                                        className="w-32 h-32 border border-gray-300 rounded-md flex items-center justify-center text-2xl text-gray-400 cursor-pointer"
                                    >
                                        +
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    id="image-upload"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                        <FormField
                            label="Item Price"
                            type="number"
                            placeholder="Enter item price"
                            value={formData.price}
                            onChange={(e) => handleFieldChange('price', e.target.value)}
                        />
                        <FormField
                            label="Item Description"
                            type="textarea"
                            placeholder="Enter item description"
                            value={formData.description}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                        />
                        <FormField
                            label="Select Food Item Category"
                            isSelect={true}
                            options={[{ value: '', label: 'Select a category' }, ...subCategories.map((cat) => ({ value: cat._id, label: cat.name }))]}
                            value={formData.category}
                            onChange={(e) => handleFieldChange('category', e.target.value)}
                        />
                        <FormField
                            label="Select Offer Type"
                            isSelect={true}
                            options={[{ value: '', label: 'Select an offer' }, ...offers.map((offer) => ({ value: offer._id, label: offer.offerName }))]}
                            value={formData.offer}
                            onChange={(e) => handleFieldChange('offer', e.target.value)}
                        />
                        <FormField
                            label="Customizable"
                            isSelect={true}
                            options={[
                                { value: 'No', label: 'No' },
                                { value: 'Yes', label: 'Yes' },
                            ]}
                            value={formData.isCustomizable ? 'Yes' : 'No'}
                            onChange={(e) => handleCustomizationChange(e.target.value)}
                        />
                        {formData.isCustomizable && (
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">Custom Fields</label>
                                <div className="space-y-6">
                                    {formData.customFields.map((field, index) => (
                                        <div key={index} className="space-y-4">
                                            <FormField
                                                label="Custom Choice Name"
                                                value={field.fieldName}
                                                onChange={(e) =>
                                                    updateCustomField(index, 'fieldName', e.target.value)
                                                }
                                                placeholder="Enter custom field name"
                                            />
                                            <FormField
                                                label="Custom Choice Options"
                                                value={field.options}
                                                onChange={(e) =>
                                                    updateCustomField(index, 'options', e.target.value)
                                                }
                                                placeholder="Enter options separated by commas"
                                            />
                                            <FormField
                                                label="Custom Choice Price"
                                                value={field.price}
                                                onChange={(e) =>
                                                    updateCustomField(index, 'price', e.target.value)
                                                }
                                                placeholder="Enter price for the choice"
                                            />
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
                        <div className="mt-6 flex justify-center">
                            <PrimaryBtn 
                            text={isAddingItem ? <BeatLoader size={10} color='white'/>:'Add Product'} 
                            className="py-3 px-8 text-xl font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
                            onClick={handleSubmit} />
                        </div>
                    </form>
                </div>
            </div>
            <AnimatePresence>
                {isCropperVisible && (
                    <motion.div
                        className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="bg-white p-4 rounded-lg w-96 relative"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <button
                                onClick={() => setIsCropperVisible(false)}
                                className="absolute top-2 right-2 text-xl bg-red-500 text-white hover:bg-red-700"
                            >
                                <AiOutlineClose />
                            </button>
                            <Cropper
                            className='mt-6'
                                ref={cropperRef}
                                src={formData.image}
                                style={{ height: 400, width: '100%' }}
                                aspectRatio={1}
                                guides={false}
                                cropBoxResizable={false}
                            />
                            <div className="mt-4 flex justify-between">
                                <button
                                    onClick={handleSelectNewImage}
                                    className="py-2 px-4 text-white bg-gray-500 rounded-md hover:bg-gray-600"
                                >
                                    Select New
                                </button>
                                <button
                                    onClick={handleDoneCrop}
                                    className="py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddItem;