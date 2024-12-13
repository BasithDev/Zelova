import { OfferModal } from './OfferModal';
import { EditModal } from './EditModal';
import PropTypes from "prop-types";
import { useState } from "react";
import { MoonLoader } from "react-spinners";

const ProductCard = ({
  product,
  onDelete,
  onToggleList,
  onChangeImage,
  onUpdateOffer,
  offers,
  onSave,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({
    productId: null,
    offerId: null,
    offerName: null,
  });

  const openConfirmModal = (productId, offerId, offerName) => {
    setSelectedOffer({ productId, offerId, offerName });
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedOffer({ productId: null, offerId: null, offerName: null });
  };

  const handleConfirmUpdate = async () => {
    if (selectedOffer?.productId && selectedOffer?.offerId !== undefined) {
      await onUpdateOffer(selectedOffer.productId, selectedOffer.offerId, offers);
    }
    closeConfirmModal();
  };

  const handleListToggle = () => {
    onToggleList(product._id, !product.isActive);
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
    <div className="bg-white w-full shadow-lg rounded-3xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 relative">
      <div className="relative flex flex-col items-start w-full sm:w-auto">
        <div className="relative w-full sm:w-48 h-48">
          {isImageLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-100 rounded-lg">
              <MoonLoader color="green" size={30} />
            </div>
          )}
          <img
            src={product.image || "https://via.placeholder.com/150"}
            alt={product.name}
            className={`w-full sm:w-48 h-48 object-cover rounded-lg transition-opacity ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsImageLoading(false)}
          />
          <button
            onClick={() => onChangeImage(product._id)}
            className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs sm:text-sm px-2 py-1.5 rounded shadow hover:bg-gray-700"
          >
            Change Image
          </button>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mt-4">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      </div>

      <div className="flex-1 w-full">
        <div className="mb-4">
          <p className="text-md font-semibold">Price: ₹{product.price}</p>
          <p className={`text-sm mt-1 ${product.offers ? "text-green-600" : "text-gray-400"}`}>
            Offer:{" "}
            {product.offers
              ? `${product.offers.discountAmount}% Off on Min of ${product.offers.requiredQuantity} Quantity`
              : "No offers"}
          </p>
          {product.customizable && product.customizations?.length > 0 && (
            <div className="text-sm text-gray-600 mt-2">
              <p className="font-medium">Customizations:</p>
              <ul className="mt-1 space-y-1">
                {product.customizations.map((custom) => (
                  <li key={custom._id} className="ml-4 list-disc">
                    <span className="font-medium">{custom.fieldName}:</span>{" "}
                    {custom.options.map((option, index) => (
                      <span key={option._id}>
                        {option.name} (₹{option.price})
                        {index !== custom.options.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded text-white text-sm sm:text-base font-semibold ${
              product.isActive
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={handleListToggle}
          >
            {product.isActive ? "Unlist" : "List"}
          </button>
          <button
            className="py-1.5 sm:py-2 px-3 sm:px-4 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-semibold rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="py-1.5 sm:py-2 px-3 sm:px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-semibold rounded"
            onClick={openEditModal}
          >
            Edit Product
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 w-full sm:w-auto mt-2 sm:mt-0">
            <label className="text-sm font-medium text-gray-600 sm:mr-2">
              Offer:
            </label>
            <select
              className="w-full sm:w-auto border border-gray-300 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-sm"
              onChange={(e) =>
                openConfirmModal(
                  product._id,
                  e.target.value,
                  e.target.options[e.target.selectedIndex].text
                )
              }
              value={product.offers?._id || ""}
            >
              <option value="">No Offer</option>
              {offers.map((offer) => (
                <option key={offer._id} value={offer._id}>
                  {offer.offerName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <EditModal
        isEditModalOpen={isEditModalOpen}
        closeEditModal={closeEditModal}
        modalVariants={modalVariants}
        product={product}
        onSave={onSave}
      />
      <OfferModal
        isConfirmModalOpen={isConfirmModalOpen}
        closeConfirmModal={closeConfirmModal}
        handleConfirmUpdate={handleConfirmUpdate}
        selectedOffer={selectedOffer}
      />
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
      _id: PropTypes.string,
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
  onToggleList: PropTypes.func.isRequired,
  onChangeImage: PropTypes.func.isRequired,
  onUpdateOffer: PropTypes.func.isRequired,
};

export default ProductCard;