import { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const CouponMng = () => {
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      name: "Summer Sale",
      code: "SUMMER20",
      description: "20% off on all items",
      type: "percentage",
      discount: 20,
      expiry: "2024-12-31T23:59",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    type: "percentage",
    discount: "",
    expiry: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCoupon = () => {
    if (!form.name || !form.code || !form.discount) {
      alert("Name, Code, and Discount are required!");
      return;
    }
    setCoupons((prev) => [...prev, { ...form, id: prev.length + 1 }]);
    resetForm();
    setShowModal(false);
  };

  const handleDeleteCoupon = (id) => {
    setCoupons((prev) => prev.filter((coupon) => coupon.id !== id));
  };

  const handleEditCoupon = () => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === currentCoupon.id ? { ...coupon, ...form } : coupon
      )
    );
    resetForm();
    setShowModal(false);
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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Manage Coupons</h1>

      <button
        onClick={openAddModal}
        className="bg-gradient-to-r mt-4 from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
      >
        + Add New Coupon
      </button>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {coupons.map((coupon) => (
          <motion.div
            key={coupon.id}
            className="p-5 bg-white border border-gray-200 rounded-lg shadow-md flex justify-between items-start hover:shadow-2xl transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{scale: 1.05}}
            transition={{type:"tween" , duration:0.1}}
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
                Expires: {coupon.expiry ? new Date(coupon.expiry).toLocaleString() : "No expiry"}
              </p>
            </div>
            <div className="flex space-x-3 mt-2">
              <button
                onClick={() => openEditModal(coupon)}
                className="text-blue-500 hover:text-blue-600"
              >
                <FiEdit size={20} />
              </button>
              <button
                onClick={() => handleDeleteCoupon(coupon.id)}
                className="text-red-500 hover:text-red-600"
              >
                <FiTrash size={20} />
              </button>
            </div>
          </motion.div>
        ))}
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

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={currentCoupon ? handleEditCoupon : handleAddCoupon}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                >
                  {currentCoupon ? "Save Changes" : "Add Coupon"}
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