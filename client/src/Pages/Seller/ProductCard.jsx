import PropTypes from "prop-types";
import { useState } from "react";
import { MoonLoader } from "react-spinners";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";

const ProductCard = ({
  product,
  onDelete,
  onListToggle,
  onChangeImage,
  offers,
  onSave,
  onChangeOffer,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleListToggle = () => {
    onListToggle(product._id, !product.isActive);
  };

  const handleDelete = () => {
    onDelete(product._id, product.name);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <div className="bg-white w-fit shadow-lg rounded-3xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 p-6 flex items-center space-x-8 relative">
      <div className="relative flex flex-col items-start">
        <div className="relative w-48 h-48">
          {isImageLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-100 rounded-lg">
              <MoonLoader color="green" size={30} />
            </div>
          )}
          <img
            src={product.image || "https://via.placeholder.com/150"}
            alt={product.name}
            className={`object-cover rounded-lg transition-opacity ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsImageLoading(false)}
          />
          <button
            onClick={() => onChangeImage(product._id)}
            className="absolute bottom-2 right-2 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow hover:bg-gray-700"
          >
            Change Image
          </button>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mt-4">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.description}</p>
      </div>
      <div className="flex-1">
        <div className="mb-4">
          <p className="text-md font-semibold mt-2">Price: ₹{product.price}</p>
          <p
            className={`text-sm mt-1 ${
              product.offers ? "text-green-600" : "text-gray-400"
            }`}
          >
            Offer:{" "}
            {product.offers
              ? product.offers.discountAmount +
                "% Off on Min of " +
                product.offers.requiredQuantity +
                " Quantity"
              : "No offers"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className={`py-2 px-4 rounded text-white font-semibold ${
              product.isActive
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={handleListToggle}
          >
            {product.isActive ? "Unlist" : "List"}
          </button>
          <button
            className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded"
            onClick={openEditModal}
          >
            Edit Product
          </button>
          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-600 mr-2">
              Offer:
            </label>
            <select
              className="border border-gray-300 rounded px-3 py-2"
              onChange={(e) => onChangeOffer(product._id, e.target.value)}
              value={product.offers?.offerName || ""}
            >
              <option value="">No Offer</option>
              {offers.map((offer) => (
                <option key={offer._id} value={offer.offerName}>
                  {offer.offerName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isEditModalOpen && (
          <Modal
            isOpen={isEditModalOpen}
            onRequestClose={closeEditModal}
            className="flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            ariaHideApp={false}
          >
            <motion.div
              className="bg-white p-5 rounded-lg shadow-lg"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Edit - {product.name}
              </h2>
              <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedProduct = {
                  ...product,
                  id: product._id,
                  name: e.target.name.value,
                  price: Number(e.target.price.value),
                  description: e.target.description.value,
                };
                onSave(updatedProduct); // Call the parent handler to save the changes
                closeEditModal(); // Close the modal after saving
              }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={product.name}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={product.price}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                  name="description"
                    defaultValue={product.description}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
    offers: PropTypes.shape({
      offerName: PropTypes.string,
      discountAmount: PropTypes.number,
      requiredQuantity: PropTypes.number,
    }),
    isActive: PropTypes.bool.isRequired,
    customizable: PropTypes.bool,
    customizations: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        fieldName: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            _id: PropTypes.string.isRequired,
          })
        ),
      })
    ),
  }).isRequired,
  offers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      offerName: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onListToggle: PropTypes.func.isRequired,
  onChangeImage: PropTypes.func.isRequired,
  onChangeOffer: PropTypes.func.isRequired,
};

export default ProductCard;