import { motion } from "framer-motion";
import PropTypes from "prop-types";

export function LocationConfirm({
  setShowLocationPopup,
  getLocationAndSetAddress,
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      <motion.div
        className="bg-white px-6 py-3 rounded-lg shadow-lg max-w-md w-full text-center"
        initial={{
          scale: 0.8,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.8,
          opacity: 0,
        }}
      >
        <h2 className="text-2xl font-bold">Allow Access to Location</h2>
        <p className="text-lg">Please Allow Access to Location to Show Nearby<span className="font-semibold text-green-800 text-xl"> Restaurants</span></p>

        {/* Get Location Button */}
        <div className="my-3">
          <button
            onClick={() => {
              setShowLocationPopup(false);
              getLocationAndSetAddress();
            }}
            className="px-6 py-3 bg-orange-400 text-xl font-semibold text-white rounded-md hover:bg-orange-500 transition-all"
          >
            Get My Location
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
}

LocationConfirm.propTypes = {
  setShowLocationPopup: PropTypes.func.isRequired, // Function to toggle the location popup visibility
  getLocationAndSetAddress: PropTypes.func.isRequired, // Function to fetch and set the location
};