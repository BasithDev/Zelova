import { useState, useEffect } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { addCoupon, getCoupons, updateCoupon, deleteCoupon } from "../../Services/apiServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";

const CouponMng = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    type: "percentage",
    discount: "",
    minPrice: "",
    expiry: "",
  });

  const fetchCoupons = async () => {
    try {
      const response = await getCoupons();
      setCoupons(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch coupons", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCoupon = async () => {
    try {
      if (!form.name || !form.code || !form.discount || !form.minPrice) {
        toast.error("Please fill all required fields", {
          position: "top-right",
          autoClose: 3000
        });
        return;
      }
      await addCoupon(form);
      toast.success("Coupon added successfully", {
        position: "top-right",
        autoClose: 3000
      });
      resetForm();
      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add coupon", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await deleteCoupon(id);
      toast.success("Coupon deleted successfully", {
        position: "top-right",
        autoClose: 3000
      });
      fetchCoupons();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete coupon", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const handleEditCoupon = async () => {
    try {
      if (!form.name || !form.code || !form.discount || !form.minPrice) {
        toast.error("Please fill all required fields", {
          position: "top-right",
          autoClose: 3000
        });
        return;
      }
      await updateCoupon(currentCoupon._id, form);
      toast.success("Coupon updated successfully", {
        position: "top-right",
        autoClose: 3000
      });
      resetForm();
      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update coupon", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const openEditModal = (coupon) => {
    setCurrentCoupon(coupon);
    setForm({ ...coupon });
    setShowModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      code: "",
      description: "",
      type: "percentage",
      discount: "",
      minPrice: "",
      expiry: "",
    });
    setCurrentCoupon(null);
  };

  const fields = [
    { name: "name", placeholder: "Coupon Name", type: "text" },
    { name: "code", placeholder: "Coupon Code", type: "text" },
    { name: "description", placeholder: "Description", type: "textarea" },
    { name: "type", placeholder: "Type", type: "select", options: ["percentage", "amount"] },
    { name: "discount", placeholder: "Discount", type: "number" },
    { name: "minPrice", placeholder: "Minimum Order Amount", type: "number" },
    { name: "expiry", placeholder: "Expiry Date (Optional)", type: "datetime-local" },
  ];

  const renderField = (field) => {
    if (field.type === "textarea") {
      return (
        <textarea
          key={field.name}
          name={field.name}
          placeholder={field.placeholder}
          value={form[field.name]}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          key={field.name}
          name={field.name}
          value={form[field.name]}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        key={field.name}
        type={field.type}
        name={field.name}
        placeholder={field.placeholder}
        value={form[field.name]}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    );
  };

  return (
    <div>
      <AdminSearchBar />
      <ToastContainer />
      <h1 className="text-3xl ms-4 font-bold text-gray-800">Manage Coupons</h1>
      <div className="flex justify-between items-center px-4 mt-4">
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="p-2 border border-gray-300 rounded-lg outline-none"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
        {coupons.length > 0 && (
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
          >
            Add New Coupon
          </button>
        )}
      </div>

      <div className="p-4">
        {coupons.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No coupons available</p>
            <button
              onClick={openAddModal}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
            >
              Add New Coupon
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {coupons
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((coupon) => (
                    <motion.div
                      key={coupon._id}
                      className="p-5 bg-white border border-gray-200 rounded-lg shadow-md flex justify-between items-start hover:shadow-2xl transition-all"
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "tween",
                        duration: 0.1
                      }}
                    >
                      <div>
                        <h2 className="text-lg font-semibold text-gray-700">{coupon.name}</h2>
                        <p className="text-sm text-gray-500">
                          Code: <span className="font-mono">{coupon.code}</span>
                        </p>
                        <p className="text-gray-500">Description: {coupon.description}</p>
                        <p className="text-gray-500">
                          Discount: {coupon.type === "percentage" ? `${coupon.discount}%` : `₹${coupon.discount}`}
                        </p>
                        <p className="text-gray-500">
                          Min. Order: {coupon.minPrice ? `₹${coupon.minPrice}` : "No minimum"}
                        </p>
                        <p className="text-gray-500">
                          Expires: {coupon.expiry ? new Date(coupon.expiry).toLocaleString() : "No expiry"}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="text-blue-500 hover:bg-gray-200 p-2 rounded-full transition-all duration-200 hover:text-blue-600"
                        >
                          <FiEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          className="text-red-500 hover:bg-gray-200 p-2 rounded-full transition-all duration-200 hover:text-red-600"
                        >
                          <FiTrash size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
            {Math.ceil(coupons.length / itemsPerPage) > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Previous
                </button>
                {[...Array(Math.ceil(coupons.length / itemsPerPage))].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage === Math.ceil(coupons.length / itemsPerPage)}
                  className={`px-3 py-1 rounded ${
                    currentPage === Math.ceil(coupons.length / itemsPerPage)
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {currentCoupon ? "Edit Coupon" : "Add Coupon"}
              </h2>

              <div className="space-y-4">{fields.map(renderField)}</div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={currentCoupon ? handleEditCoupon : handleAddCoupon}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
                >
                  {currentCoupon ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponMng;