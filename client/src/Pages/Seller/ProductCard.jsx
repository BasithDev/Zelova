import { OfferModal } from './OfferModal';
import { EditModal } from './EditModal';
import PropTypes from "prop-types";
import { useState } from "react";
import { MoonLoader } from "react-spinners";


const ProductCard = ({
  product,
  onDelete,
  onListToggle,
  onChangeImage,
  onOfferChange,
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
      await onOfferChange(selectedOffer.productId, selectedOffer.offerId,offers);
    }
    closeConfirmModal();
  };


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
            className={`object-cover rounded-lg transition-opacity ${isImageLoading ? "opacity-0" : "opacity-100"
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
            className={`text-sm mt-1 ${product.offers ? "text-green-600" : "text-gray-400"
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
          {product.customizable && product.customizations?.length > 0 && (
            <div className="text-sm text-gray-600 mt-2">
              Customizations:
              <ul className="mt-1">
                {product.customizations.map((custom) => (
                  <li key={custom._id} className="ml-4 list-disc">
                    {custom.fieldName}:{" "}
                    {custom.options.map((option) => (
                      <span key={option._id}>
                        {option.name} (₹{option.price})
                        {", "}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className={`py-2 px-4 rounded text-white font-semibold ${product.isActive
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
              onChange={(e) =>
                openConfirmModal(product._id, e.target.value, e.target.options[e.target.selectedIndex].text)
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
      <EditModal   isEditModalOpen={isEditModalOpen} closeEditModal={closeEditModal} modalVariants={modalVariants} product={product} onSave={onSave}  />
      <OfferModal   isConfirmModalOpen={isConfirmModalOpen} closeConfirmModal={closeConfirmModal} handleConfirmUpdate={handleConfirmUpdate} selectedOffer={selectedOffer} />
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
  onListToggle: PropTypes.func.isRequired,
  onChangeImage: PropTypes.func.isRequired,
  onOfferChange: PropTypes.func.isRequired,
};

export default ProductCard;