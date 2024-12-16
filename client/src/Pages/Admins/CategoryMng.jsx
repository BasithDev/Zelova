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
    const [categoryPage, setCategoryPage] = useState(1);
    const [subCategoryPage, setSubCategoryPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

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

    // Pagination calculations for categories
    const indexOfLastCategory = categoryPage * itemsPerPage;
    const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
    const totalCategoryPages = Math.ceil(filteredCategories.length / itemsPerPage);

    // Pagination calculations for subcategories
    const indexOfLastSubCategory = subCategoryPage * itemsPerPage;
    const indexOfFirstSubCategory = indexOfLastSubCategory - itemsPerPage;
    const currentSubCategories = filteredSubCategories.slice(indexOfFirstSubCategory, indexOfLastSubCategory);
    const totalSubCategoryPages = Math.ceil(filteredSubCategories.length / itemsPerPage);

    const paginateCategories = (pageNumber) => setCategoryPage(pageNumber);
    const paginateSubCategories = (pageNumber) => setSubCategoryPage(pageNumber);

    return (
        <div className="bg-gray-100 min-h-screen">
            <ToastContainer position="top-right" autoClose={2000} />
            <AdminSearchBar />
            <motion.h1
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-4xl font-bold mb-8 text-center text-gray-800"
            >
                Category Management
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        opacity: { duration: 0.5 },
                        y: { type: "spring", stiffness: 100, damping: 20 },
                    }}
                    className="bg-white p-6 rounded-lg shadow-lg"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-700">
                            Categories
                        </h2>
                        <div className="flex items-center gap-4">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCategoryPage(1);
                                    setSubCategoryPage(1);
                                }}
                                className="p-2 border border-gray-300 rounded-lg outline-none"
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={categorySearchTerm}
                                onChange={(e) => {
                                    setCategorySearchTerm(e.target.value);
                                    setCategoryPage(1);
                                }}
                                className="p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                    </div>
                    <AnimatePresence>
                        {filteredCategories.length > 0 ? (
                            <>
                                <ul className="divide-y divide-gray-200">
                                    {currentCategories.map((category) => (
                                        <motion.li
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            key={category._id}
                                            className="flex justify-between items-center py-3"
                                        >
                                            <span className="text-gray-700 text-lg">
                                                {category.name}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteCategory(category._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                                            >
                                                Delete
                                            </button>
                                        </motion.li>
                                    ))}
                                </ul>
                                {totalCategoryPages > 1 && (
                                    <div className="mt-4 flex justify-center gap-2">
                                        <button
                                            onClick={() => paginateCategories(categoryPage - 1)}
                                            disabled={categoryPage === 1}
                                            className={`px-3 py-1 rounded ${
                                                categoryPage === 1
                                                    ? 'bg-gray-200 cursor-not-allowed'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        {[...Array(totalCategoryPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => paginateCategories(index + 1)}
                                                className={`px-3 py-1 rounded ${
                                                    categoryPage === index + 1
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 hover:bg-gray-300'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => paginateCategories(categoryPage + 1)}
                                            disabled={categoryPage === totalCategoryPages}
                                            className={`px-3 py-1 rounded ${
                                                categoryPage === totalCategoryPages
                                                    ? 'bg-gray-200 cursor-not-allowed'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-600 text-center py-4">No categories found.</p>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        opacity: { duration: 0.5 },
                        y: { type: "spring", stiffness: 100, damping: 20 },
                    }}
                    className="bg-white p-6 rounded-lg shadow-lg"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-700">
                            Sub-Categories
                        </h2>
                        <input
                            type="text"
                            placeholder="Search sub-categories..."
                            value={subCategorySearchTerm}
                            onChange={(e) => {
                                setSubCategorySearchTerm(e.target.value);
                                setSubCategoryPage(1);
                            }}
                            className="p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <AnimatePresence>
                        {filteredSubCategories.length > 0 ? (
                            <>
                                <ul className="divide-y divide-gray-200">
                                    {currentSubCategories.map((subCategory) => (
                                        <motion.li
                                            key={subCategory._id}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="flex justify-between items-center py-3"
                                        >
                                            <span className="text-gray-700 text-lg">
                                                {`${subCategory.name} - `} <span className="text-gray-500">{`${subCategory.categoryName}`}</span>
                                            </span>
                                            <button
                                                onClick={() => handleDeleteSubCategory(subCategory._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                                            >
                                                Delete
                                            </button>
                                        </motion.li>
                                    ))}
                                </ul>
                                {totalSubCategoryPages > 1 && (
                                    <div className="mt-4 flex justify-center gap-2">
                                        <button
                                            onClick={() => paginateSubCategories(subCategoryPage - 1)}
                                            disabled={subCategoryPage === 1}
                                            className={`px-3 py-1 rounded ${
                                                subCategoryPage === 1
                                                    ? 'bg-gray-200 cursor-not-allowed'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        {[...Array(totalSubCategoryPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => paginateSubCategories(index + 1)}
                                                className={`px-3 py-1 rounded ${
                                                    subCategoryPage === index + 1
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 hover:bg-gray-300'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => paginateSubCategories(subCategoryPage + 1)}
                                            disabled={subCategoryPage === totalSubCategoryPages}
                                            className={`px-3 py-1 rounded ${
                                                subCategoryPage === totalSubCategoryPages
                                                    ? 'bg-gray-200 cursor-not-allowed'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-600 text-center py-4">
                                No subcategories found.
                            </p>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default ItemsAndCategoryMng;