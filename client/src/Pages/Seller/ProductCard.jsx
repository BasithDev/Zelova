import PropTypes from "prop-types";

const ProductCard = ({
  product,
  onDelete,
  onListToggle,
  onEdit,
  onChangeImage,
  offers,
  onChangeOffer,
}) => 
    
    (
  <div className="bg-white w-fit shadow-lg rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-200 p-6 flex items-center space-x-8 relative">
    <div className="relative flex flex-col items-start">
      <div className="relative w-48 h-48">
        <img
          src={product.image || "https://via.placeholder.com/150"}
          alt={product.name}
          className="object-cover rounded-lg"
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
          Offer: {product.offers ? product.offers.discountAmount + "% Off " + `on Min of ${product.offers.requiredQuantity} Quantity` : "No offers"}
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
          className={`py-2 px-4 rounded text-white font-semibold ${
            product.isActive
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-500 hover:bg-gray-600"
          }`}
          onClick={() => onListToggle(product._id)}
        >
          {product.isActive ? "Unlist Product" : "List Product"}
        </button>
        <button
          className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded"
          onClick={() => onDelete(product._id)}
        >
          Delete
        </button>
        <button
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded"
          onClick={() => onEdit(product._id)}
        >
          Edit Product
        </button>
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-600 mr-2">Offer:</label>
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
  </div>
);

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
        requiredQuantity : PropTypes.number
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
  offers: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onListToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onChangeImage: PropTypes.func.isRequired,
  onChangeOffer: PropTypes.func.isRequired,
};

export default ProductCard;