import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import Modal from "react-modal";

export function OfferModal({
  isConfirmModalOpen,
  closeConfirmModal,
  handleConfirmUpdate,
  selectedOffer,
}) {
  return (
    <AnimatePresence>
      {isConfirmModalOpen && (
        <Modal
          isOpen={isConfirmModalOpen}
          onRequestClose={closeConfirmModal}
          className="flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          ariaHideApp={false}
        >
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Update
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to update the offer to{" "}
              <span className="font-semibold text-blue-600">
                {selectedOffer.offerName || "to be removed"}
              </span>
              ?
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmUpdate()}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}

OfferModal.propTypes = {
  isConfirmModalOpen: PropTypes.bool.isRequired,
  closeConfirmModal: PropTypes.func.isRequired,
  handleConfirmUpdate: PropTypes.func.isRequired,
  selectedOffer: PropTypes.shape({
    offerName: PropTypes.string,
  }),
};