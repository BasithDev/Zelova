import PrimaryBtn from '../../../Components/Buttons/PrimaryBtn';
import { useState, useEffect } from "react";
import { addCategory, addSubCategory, getCategories } from '../../../Services/apiServices'
import { toast } from 'react-toastify';
const AddFoodCategories = () => {
    const [mainCategory, setMainCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            let data = response.data.categories
            setCategories(data || []);
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };
    
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        if (!mainCategory.trim()) {
            toast.error('Category name is required.');
            return;
        }
        try {
            const response = await addCategory({ name: mainCategory });
            toast.success(response.message || 'Category added successfully.');
            setMainCategory('');
            fetchCategories();
        } catch (error) {
            console.log(error.response.data)
        }
    };

    const handleAddSubCategory = async () => {
        if (!selectedCategory) {
            toast.error('Please select a main category.');
            return;
        }
        if (!subCategory.trim()) {
            toast.error('Subcategory name is required.');
            return;
        }
        try {
            const response = await addSubCategory({
                name: subCategory,
                categoryName: selectedCategory,
            });
            toast.success(response.message || 'Subcategory added successfully.');
            setSubCategory('');
            window.dispatchEvent(new Event('updateDropdownData'));
        } catch (error) {
            console.log(error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to add subcategory.');
        }
    };
    return (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Food Categories managment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700 mb-2">Add Main Food Category</label>
                    <input
                        type="text"
                        className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter main category"
                        value={mainCategory}
                        onChange={(e) => setMainCategory(e.target.value)}
                    />
                    <PrimaryBtn
                        text="Add Main Category"
                        onClick={handleAddCategory}
                        className="mt-4 px-6 py-3 text-xl font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-medium text-gray-700 mb-2">Select Main Food Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category?._id} value={category?.name || 'loading...'}>
                                {category?.name || 'loading..'}
                            </option>
                        ))}
                    </select>
                    <label className="text-lg font-medium text-gray-700 mb-2 mt-4">Add Subcategory</label>
                    <input
                        type="text"
                        className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter subcategory"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                    />
                    <PrimaryBtn
                        text="Add Subcategory"
                        onClick={handleAddSubCategory}
                        className="mt-4 px-6 py-3 text-xl font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddFoodCategories