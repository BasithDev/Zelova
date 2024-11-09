import { motion } from 'framer-motion';
import { FcShop, FcBusinessman } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux'; 
import { useEffect } from "react";
import { fetchUserData } from '../../Redux/slices/userDataSlice'

const RoleManagement = () => {
  const userID = useSelector((state)=>state.authUser.userId)
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    const userId = userID
    dispatch(fetchUserData(userId));
}, [dispatch,userID]);

const userData = useSelector((state)=>state.userData.data)
const isVendor = userData?.isVendor || null

const handleRoleSelection = () => {
  if (isVendor) {
    navigate('/vendor', { replace: true });
  } else {
    navigate('/', { replace: true });
  }
};

  return (
    <motion.div 
      className="flex items-center justify-center min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Choose Your Role</h2>
        <p className="text-gray-500 mb-6">Do you want to continue as a Vendor or User?</p>
        
        <div className="flex items-center justify-around space-x-6">
          <button 
            onClick={() => handleRoleSelection()} 
            className="flex flex-col items-center bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:from-green-500 hover:to-green-600 transition-all duration-200"
          >
            <FcShop className="text-4xl mb-1" />
            <span className="font-medium">Vendor</span>
          </button>

          <button 
            onClick={() => handleRoleSelection()} 
            className="flex flex-col items-center bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition-all duration-200"
          >
            <FcBusinessman className="text-4xl mb-1" />
            <span className="font-medium">User</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoleManagement;