import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";

function LogoutConfirm({ showLogoutConfirm, setShowLogoutConfirm, handleLogout }) {
  return (
    <AnimatePresence>
      {showLogoutConfirm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg text-center"
            initial={{
              scale: 0.8,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            exit={{
              scale: 0.8,
              opacity: 0
            }}
          >
            <h2 className="text-xl font-bold mb-4">Are you sure you want to log out?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes, Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


LogoutConfirm.propTypes = {
  showLogoutConfirm: PropTypes.bool.isRequired,
  setShowLogoutConfirm: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired
};

export default LogoutConfirm;