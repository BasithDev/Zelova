import { useEffect, useState,useCallback } from "react";
import ProductCard from "./ProductCard";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getProducts , getOffers} from "../../Services/apiServices";
import { ToastContainer, toast } from "react-toastify";

const Menu = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(()=>{
    fetchProducts()
  },[])

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleSort = (e) => {
    setSortBy(e.target.value);
    setIsDropdownOpen(false);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right"/>
      <h1 className="text-4xl font-bold mb-6 text-center">Menu</h1>
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
            onClick={() => console.log('hello')}
          >
            <FiSearch size={20} />
          </button>
        </div>

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
                    onClick={() => handleSort({ target: { value: "name" } })}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    Sort by Name
                  </li>
                  <li
                    onClick={() => handleSort({ target: { value: "price" } })}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    Sort by Price
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold">No products found!</h2>
          <p className="text-gray-500">Try adjusting your search or add new products.</p>
          <button
            onClick={()=>navigate('/vendor/add-items')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add a Product
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 px-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={(id) => console.log(`Delete ${id}`)}
                onListToggle={(id) => console.log(`Toggle List/Unlist ${id}`)}
                onEdit={(id) => console.log(`Edit Info ${id}`)}
                onChangeImage={(id) => console.log(`Change Image ${id}`)}
                offers={offers}
                onChangeOffer={(id, value) =>
                  console.log(`Change Offer ${id} to ${value}`)
                }
              />
            ))}
          </div>

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