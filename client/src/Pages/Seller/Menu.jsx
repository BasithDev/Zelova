import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import ProductCard from "./ProductCard";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  getProducts , 
  getOffers , 
  listOrUnlistProduct ,
  deleteProduct , 
  updateProduct, 
  updateProductOffer 
} from "../../Services/apiServices";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { uploadImageToCloud } from '../../Helpers/uploadImageToCloud';

const Menu = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCropperVisible, setIsCropperVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const cropperRef = useRef(null);

  const itemsPerPage = 4;

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOffers();
      setOffers(response.data.offers);
    } catch (err) {
      console.error("Error fetching offers:", err);
      toast.error("Failed to fetch offers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
    fetchProducts();
  }, [fetchOffers, fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
  
        if (sortBy === "listed") return matchesSearch && product.isActive;
        if (sortBy === "unlisted") return matchesSearch && !product.isActive;
  
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
  
        return 0;
      });
  }, [products, search, sortBy]);
  

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / itemsPerPage);
  }, [filteredProducts]);

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((value) => {
    setSortBy(value);
    setIsDropdownOpen(false);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleListToggle = async (productId, newStatus) => {
    try {
      await listOrUnlistProduct(productId, newStatus);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, isActive: newStatus } : product
        )
      );
      toast.success(
        `Product ${newStatus ? "listed" : "unlisted"} successfully!`
      );
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast.error("Failed to update product status. Please try again.");
    }
  };

  const handleDelete = async (productId, productName) => {
    const result = await Swal.fire({
      title: `Do you want to Remove <br><b>"${productName}"</b><br> from the menu`,
      text: `This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      try {
        await deleteProduct(productId);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        toast.success(`${productName} deleted successfully!`);
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error(`Failed to delete ${productName}. Please try again.`);
      }
    }
  };

  const handleProductUpdate = async (updatedProduct)=>{
    try {
      const updateData = {
        id: updatedProduct._id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        description: updatedProduct.description,
        image: updatedProduct.image
      };
      const response = await updateProduct(updateData);
      setProducts((prev) => {
        const index = prev.findIndex((product) => product._id === updatedProduct._id);
        if (index === -1) return prev;
        const updatedProducts = [...prev];
        updatedProducts[index] = { ...prev[index], ...response.data.updatedProduct };
        return updatedProducts;
      });
      
      toast.success("Product Updated Successfully!")
    } catch (error) {
      console.log(error)
      toast.error("Failed to update product!")
    }
  }

  const handleProductOfferUpdate = async (productId, offerId) => {
    try {
      await updateProductOffer({ productId, offerId });
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId
            ? {
                ...product,
                offers: offerId
                  ? { _id:offerId, offerName: offers.find((o) => o._id === offerId)?.offerName , discountAmount:offers.find((o) => o._id === offerId)?.discountAmount , requiredQuantity: offers.find((o) => o._id === offerId)?.requiredQuantity}
                  : null,
              }
            : product
        )
      );
  
      toast.success("Product Offer Updated Successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product offer.");
    }
  };

  const handleImageChange = (e, product) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setSelectedProduct(product);
        setIsCropperVisible(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDoneCrop = async () => {
    if (cropperRef.current && selectedProduct) {
      try {
        setIsUpdatingImage(true);
        const croppedData = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
        const uploadedImage = await uploadImageToCloud(croppedData);
        
        const updatedProduct = {
          ...selectedProduct,
          image: uploadedImage.secure_url
        };
        
        await handleProductUpdate(updatedProduct);
        setIsCropperVisible(false);
        setSelectedProduct(null);
        setTempImage(null);
      } catch (error) {
        console.error('Error updating image:', error);
        toast.error('Failed to update image. Please try again.');
      } finally {
        setIsUpdatingImage(false);
      }
    }
  };

  const handleCancelCrop = () => {
    setIsCropperVisible(false);
    setSelectedProduct(null);
    setTempImage(null);
  };

  const pageVariants = {
    initial: { opacity: 0, x: "5%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-5%" },
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" />
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center">Menu</h1>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center px-4 sm:px-6 mb-6 gap-4">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            className="border border-gray-300 rounded-full px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">
            <FiSearch size={20} />
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-auto border border-gray-300 rounded px-4 py-2 bg-white flex items-center justify-between sm:justify-start gap-2 focus:outline-none"
          >
            <span className="flex-1 sm:flex-none">Sort By: {sortBy === "name" ? "Name" : sortBy === "price" ? "Price" : sortBy === "listed" ? "Listed Items" : "Unlisted Items"}</span>
            <span className={`transform ${isDropdownOpen ? "rotate-180" : ""}`}>▼</span>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
              >
                <ul>
                  <li onClick={() => handleSort("name")} className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                    By Name
                  </li>
                  <li onClick={() => handleSort("price")} className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                    By Price
                  </li>
                  <li onClick={() => handleSort("listed")} className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                    Listed Items
                  </li>
                  <li onClick={() => handleSort("unlisted")} className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                    Unlisted Items
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl sm:text-2xl font-semibold">No products found!</h2>
          <p className="text-gray-500 mt-2">Try adjusting your search or add new products.</p>
          <button
            onClick={() => navigate("/vendor/add-items")}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add a Product
          </button>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-6"
            >
              {paginatedProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard
                    product={product}
                    onSave={handleProductUpdate}
                    onDelete={handleDelete}
                    onToggleList={handleListToggle}
                    onUpdateOffer={handleProductOfferUpdate}
                    offers={offers}
                    onImageChange={handleImageChange}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 px-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      <AnimatePresence>
        {isCropperVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
              <h3 className="text-lg font-semibold mb-4">Crop Image</h3>
              <Cropper
                ref={cropperRef}
                src={tempImage}
                style={{ height: 400, width: "100%" }}
                aspectRatio={1}
                guides={true}
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={handleCancelCrop}
                  disabled={isUpdatingImage}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDoneCrop}
                  disabled={isUpdatingImage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdatingImage ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    'Update Image'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;