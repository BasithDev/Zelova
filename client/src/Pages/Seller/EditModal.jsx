import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import Modal from "react-modal";

export function EditModal({
  isEditModalOpen,
  closeEditModal,
  modalVariants,
  product,
  onSave,
}) {
  return (
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
                onSave(updatedProduct);
                closeEditModal();
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
                  required
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
                  required
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
                  required
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
  );
}

EditModal.propTypes = {
  isEditModalOpen: PropTypes.bool.isRequired,
  closeEditModal: PropTypes.func.isRequired,
  modalVariants: PropTypes.object.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};