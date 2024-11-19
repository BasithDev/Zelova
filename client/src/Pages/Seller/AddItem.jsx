import PrimaryBtn from '../../Components/Buttons/PrimaryBtn';
import { useState} from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddFoodCategories from './AddFoodCategories'
import AddOffers from './AddOffers';
import { addProduct } from '../../Services/apiServices';
import FormField from './FormField';
const AddItem = () => {
    const [isCustomizable, setIsCustomizable] = useState(false);
    const [customFields, setCustomFields] = useState([]);

    const handleCustomizationChange = (e) => {
        setIsCustomizable(e.target.value === "Yes");
        if (e.target.value === "No") {
            setCustomFields([]);
        }
    };

    const addCustomField = () => {
        setCustomFields([...customFields, { fieldName: "", options: "", price: "" }]);
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
                        <FormField label="Item Name" placeholder="Enter item name" />
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
                        <FormField label="Item Price" type='number' placeholder="Enter item price" />
                        <FormField label="Item Description" type="textarea" placeholder="Enter item description" />
                        <FormField
                            label="Select Food Item Category"
                            isSelect={true}
                            options={[{ value: "", label: "Select a category" }]}
                        />
                        <FormField
                            label="Select Offer Type"
                            isSelect={true}
                            options={[{ value: "", label: "Select an offer" }]}
                        />
                        <FormField
                            label="Customizable"
                            isSelect={true}
                            onChange={handleCustomizationChange}
                            options={[
                                { value: "No", label: "No" },
                                { value: "Yes", label: "Yes" },
                            ]}
                        />

                        {isCustomizable && (
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">Custom Fields</label>
                                <div className="space-y-6">
                                    {customFields.map((field, index) => (
                                        <div key={index} className="space-y-4">
                                            <FormField
                                                label="Custom Choice Name"
                                                name="fieldName"
                                                value={field.fieldName}
                                                onChange={(e) => handleFieldChange(index, e)}
                                                placeholder="Enter custom field name"
                                            />
                                            <FormField
                                                label="Custom Choice Options"
                                                name="options"
                                                value={field.options}
                                                onChange={(e) => handleFieldChange(index, e)}
                                                placeholder="Enter options separated by commas"
                                            />
                                            <FormField
                                                label="Custom Choice Price"
                                                name="price"
                                                value={field.price}
                                                onChange={(e) => handleFieldChange(index, e)}
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

                        <div className="flex justify-center">
                            <PrimaryBtn
                                text="Add Item"
                                onClick={() => console.log("Item Added")}
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