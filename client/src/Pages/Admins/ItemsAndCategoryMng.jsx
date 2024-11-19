import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";
import {
    deleteCategory,
    deleteSubCategory,
    getCategoriesToMng,
    getSubCategoriesToMng,
} from "../../Services/apiServices";

const ItemsAndCategoryMng = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [categorySearchTerm, setCategorySearchTerm] = useState("");
    const [subCategorySearchTerm, setSubCategorySearchTerm] = useState("");

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, x: -50 },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryData = await getCategoriesToMng();
                const subCategoryData = await getSubCategoriesToMng();
                setCategories(categoryData.data.data || []);
                setSubCategories(subCategoryData.data.data || []);
            } catch (error) {
                console.log(error)
            }
        };

        fetchData();
    }, []);

    const handleDeleteCategory = async (id) => {
        try {
            await deleteCategory(id);
            setCategories(categories.filter((category) => category._id !== id));
            toast.success("Category deleted successfully!");
        } catch (error) {
            console.log(error)
        }
    };

    const handleDeleteSubCategory = async (id) => {
        try {
            await deleteSubCategory(id);
            setSubCategories(
                subCategories.filter((subCategory) => subCategory._id !== id)
            );
            toast.success("Subcategory deleted successfully!");
        } catch (error) {
            console.log(error)
        }
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );

    const filteredSubCategories = subCategories.filter((subCategory) =>
        subCategory.name.toLowerCase().includes(subCategorySearchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-100 min-h-screen">
            <ToastContainer position="top-right" autoClose={2000} />
            <AdminSearchBar />
            <motion.h1
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-3xl px-3 font-bold mb-6 text-center text-gray-800"
            >
                Category Management
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    opacity: { duration: 0.5 },
                    y: { type: "spring", stiffness: 100, damping: 20 },
                }}
                className="bg-white p-6 mx-auto rounded-lg shadow-lg"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Available Categories
                    </h2>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearchTerm}
                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                        className="p-3 border w-1/2 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                <AnimatePresence>
                    {filteredCategories.length > 0 ? (

                        <ul className="space-y-4">
                            {filteredCategories.map((category) => (
                                <motion.li
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    key={category._id}
                                    className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg shadow transition"
                                >
                                    <span className="text-gray-700 text-xl font-medium">
                                        {category.name}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteCategory(category._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                                    >
                                        Delete
                                    </button>
                                </motion.li>
                            ))}
                        </ul>

                    ) : (
                        <p className="text-gray-600 text-center py-6">No categories found.</p>
                    )}
                </AnimatePresence>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-3xl mt-10 px-3 font-bold mb-6 text-center text-gray-800"
            >
                Sub-Category Management
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    opacity: { duration: 0.5 },
                    y: { type: "spring", stiffness: 100, damping: 20 },
                }}
                className="bg-white p-6 mx-auto rounded-lg shadow-lg"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Available Sub-Categories
                    </h2>
                    <input
                        type="text"
                        placeholder="Search sub-categories..."
                        value={subCategorySearchTerm}
                        onChange={(e) => setSubCategorySearchTerm(e.target.value)}
                        className="p-3 border w-1/2 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                <AnimatePresence>
                    {filteredSubCategories.length > 0 ? (
                        <ul className="space-y-4">
                            {filteredSubCategories.map((subCategory) => (
                                <motion.li
                                    key={subCategory._id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg shadow transition"
                                >
                                    <span className="text-gray-700 text-xl font-medium">
                                        {`${subCategory.name} - `} <span className="text-gray-500">{`${subCategory.categoryName}`}</span>
                                    </span>
                                    <button
                                        onClick={() => handleDeleteSubCategory(subCategory._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                                    >
                                        Delete
                                    </button>
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 text-center py-6">
                            No subcategories found.
                        </p>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ItemsAndCategoryMng;