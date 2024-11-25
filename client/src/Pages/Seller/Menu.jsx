import { useEffect, useState, useCallback, useMemo } from "react";
import ProductCard from "./ProductCard";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getProducts, getOffers, listOrUnlistProduct ,deleteProduct , updateProduct, updateProductOffer } from "../../Services/apiServices";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

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
      const response = await updateProduct(updatedProduct)
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
  
  

  const pageVariants = {
    initial: { opacity: 0, x: "5%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-5%" },
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" />
      <h1 className="text-4xl font-bold mb-6 text-center">Menu</h1>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 mb-6 gap-4">
        <div className="relative w-full md:w-1/2 mx-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            className="border border-gray-300 rounded-full px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            <FiSearch size={20} />
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="border border-gray-300 rounded px-4 py-2 bg-white flex items-center gap-2 focus:outline-none"
          >
            Sort By: {sortBy === "name" ? "Name" : "Price"}
            <span className={`transform ${isDropdownOpen ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>

          <AnimatePresence>
  {isDropdownOpen && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10"
    >
      <ul>
        <li
          onClick={() => handleSort("name")}
          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
        >
          By Name
        </li>
        <li
          onClick={() => handleSort("price")}
          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
        >
          By Price
        </li>
        <li
          onClick={() => handleSort("listed")}
          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
        >
          Listed Items
        </li>
        <li
          onClick={() => handleSort("unlisted")}
          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
        >
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
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold">No products found!</h2>
          <p className="text-gray-500">Try adjusting your search or add new products.</p>
          <button
            onClick={() => navigate("/vendor/add-items")}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 px-6"
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
                    onListToggle={handleListToggle}
                    onChangeImage={(id) => console.log(`Change Image ${id}`)}
                    onOfferChange={handleProductOfferUpdate}
                    offers={offers}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;