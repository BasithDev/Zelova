import { Tooltip } from 'react-tooltip'
import { LoadingScreen } from './LoadingScreen';
import { LocationConfirm } from '../Common/LocationConfirm';
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdLogOut } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../Services/apiServices";
import { logoutUser } from "../../Redux/slices/user/authUserSlice";
import { fetchUserData } from '../../Redux/slices/user/userDataSlice';
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { MdHome, MdStore } from "react-icons/md";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import LogoutConfirm from "../Common/LogoutConfirm";
import { Outlet } from 'react-router-dom';
import {setAddress,setCoordinates} from '../../Redux/slices/user/userLocationSlice'
import CartSnackbar from '../Cart/CartSnackbar';
import { BsThreeDots } from "react-icons/bs";

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [userAddress, setUserAddress] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GMAP_KEY;


  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const userData = useSelector((state) => state.userData.data);
  const isVendor = userData?.isVendor || null;
  const profilePicture = userData?.profilePicture?.replace(/=s\d+-c$/, "=s96-c");
  const navItems = [
    { path: "/", label: "Home", icon: <MdHome /> },
    { path: "/favourites", label: "Favourites", icon: <FaHeart /> },
    { path: "/orders", label: "Orders", icon: <BiSolidPurchaseTag /> },
    { path: "/coins", label: "Coins", icon: <p className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">Z</p> },
    { path: "/share-supplies", label: "Share Supplies", icon: <img src="/src/assets/shareSup.png" alt="Share" className="w-6" /> },
    { path: "/get-supplies", label: "Get Supplies", icon: <img src="/src/assets/searchLove.png" alt="Get" className="w-6" /> },
  ];

  const renderNavItem = ({ path, label, icon }) => (
    <div
      key={path}
      onClick={() => navigate(path)}
      className={`flex items-center gap-3 hover:scale-105 cursor-pointer p-3 mx-4 rounded-lg transition-all ${location.pathname === path ? "bg-orange-400 text-white hover:bg-orange-500" : "bg-gray-200 text-gray-500 hover:bg-gray-300"
        }`}
    >
      {icon}
      <p className="text-lg font-semibold">{label}</p>
    </div>
  );

  const handleLogout = async () => {
    try {
      const role = "user";
      dispatch(logoutUser());
      await logout(role);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (isVendor) {
    Cookies.set("is_vendor", "true");
  }

  const fetchAddressFromCoordinates = useCallback(async (lat, lon) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const address = data.results[0]?.formatted_address;
        return address;
      } else {
        console.error("Error fetching address:", data.status);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
    return null;
  }, [GOOGLE_MAPS_API_KEY]);

  const getLocationAndSetAddress = useCallback(async () => {
    if (navigator.geolocation) {
      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setCoordinates({ lat: latitude, lng: longitude }));
          const address = await fetchAddressFromCoordinates(latitude, longitude);
          if (address) {
            setUserAddress(address);
            dispatch(setAddress(address))
          }
        },
        () => {
          setShowLocationPopup(true);
        },
        geoOptions
      );
    } else {
      setShowLocationPopup(true);
    }
  }, [fetchAddressFromCoordinates,dispatch]);


  useEffect(() => {
    getLocationAndSetAddress()
  }, [getLocationAndSetAddress]);


  if (!userData) return (
    <LoadingScreen />
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen relative">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex bg-gray-100 hide-scrollbar h-screen w-[280px] fixed top-0 left-0 bottom-0 text-center shadow-lg flex-col justify-between overflow-y-auto">
        <div>
          <p className="text-4xl lg:text-5xl font-semibold mt-3 mb-5 text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text cursor-pointer">Zelova</p>
          <nav className="space-y-4">
            {navItems.map(renderNavItem)}
            {isVendor && (
              <motion.div
                onClick={() => navigate("/vendor")}
                className="flex hover:scale-105 items-center cursor-pointer p-3 mx-4 bg-blue-200 rounded-lg transition-all duration-300 hover:bg-blue-300"
                whileHover="hover"
              >
                <motion.p
                  className="text-lg font-semibold text-blue-600"
                  variants={{
                    hover: { opacity: 0 },
                  }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <MdStore className="text-xl text-blue-600 mr-2" />
                </motion.p>
                <motion.p
                  className="text-lg font-semibold text-blue-600"
                  variants={{
                    hover: {
                      scale: 1.1,
                      fontWeight: 600,
                    },
                  }}
                  transition={{ type: "tween", duration: 0.4 }}
                >
                  Switch to Vendor
                </motion.p>
              </motion.div>
            )}
          </nav>
        </div>
        <div className="mb-3 mx-4 mt-6 space-y-3">
          <div className="relative">
            <div
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-4 cursor-pointer p-4 ${
                location.pathname === "/profile"
                  ? "bg-orange-400 hover:bg-orange-500"
                  : "bg-gray-200 hover:bg-gray-300"
              } hover:scale-105 rounded-lg transition-all shadow-md`}
            >
              {userData?.profilePicture ? (
                <img
                  referrerPolicy="no-referrer"
                  src={profilePicture || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg"}
                  alt="Profile"
                  className="rounded-full w-12 h-12 border border-gray-300"
                />
              ) : (
                <FaUser className="text-3xl text-gray-600 bg-gray-300 p-2 rounded-full" />
              )}
              <div className="flex flex-col items-start w-[70%]">
                <p className={`font-semibold text-lg ${location.pathname === "/profile" ? "text-white" : "text-gray-700"}`}>
                  {userData?.fullname}
                </p>
                <p
                  onClick={() => setShowDropdown(!showDropdown)}
                  data-tooltip-id="address-tooltip"
                  data-tooltip-content={`${userAddress}`}
                  className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis ${
                    location.pathname === "/profile" ? "text-orange-100" : "text-gray-500"
                  } w-full max-w-full`}
                >
                  {userAddress || "Loading..."}
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setShowLogoutConfirm(true)}
            className="flex hover:scale-105 items-center justify-center gap-2 cursor-pointer p-3 border-2 border-red-500 text-red-600 rounded-lg transition-all hover:bg-red-100"
          >
            <p className="font-semibold">Logout</p>
            <IoMdLogOut className="text-xl" />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden w-full bg-gray-100 shadow-md p-4 flex justify-between items-center fixed top-0 z-10">
        <p className="text-2xl font-semibold text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text">Zelova</p>
        <div className="flex items-center gap-3">
          <p
            data-tooltip-id="address-tooltip"
            data-tooltip-content={`${userAddress}`}
            className="text-sm text-gray-500 truncate max-w-[150px]"
          >
            {userAddress || "Loading..."}
          </p>
          {userData?.profilePicture ? (
            <img
              referrerPolicy="no-referrer"
              src={profilePicture}
              alt="Profile"
              onClick={() => setShowDropdown(!showDropdown)}
              className="rounded-full w-10 h-10 border border-gray-300 cursor-pointer"
            />
          ) : (
            <FaUser 
              className="text-2xl text-gray-600 bg-gray-300 p-2 rounded-full cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            />
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed top-16 right-4 bg-white rounded-lg shadow-lg z-50 min-w-[200px]"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border-b"
            >
              <p className="font-semibold text-gray-700 truncate">{userData?.fullname}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigate('/profile');
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                Profile
              </motion.button>
              {isVendor && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate('/vendor');
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-blue-600"
                >
                  Switch to Vendor
                </motion.button>
              )}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setShowDropdown(false);
                }}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer border-2 border-red-500 text-red-600 m-2"
              >
                <span className="font-semibold">Logout</span>
                <IoMdLogOut className="text-xl" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] mt-16 lg:mt-0 mb-16 lg:mb-0">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-10">
        <div className="flex justify-between items-center px-4 py-2">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/'
                ? "text-orange-500"
                : "text-gray-500"
            }`}
          >
            <span className="text-xl mb-1"><MdHome /></span>
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => navigate('/favourites')}
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/favourites'
                ? "text-orange-500"
                : "text-gray-500"
            }`}
          >
            <span className="text-xl mb-1"><FaHeart /></span>
            <span className="text-xs">Favourites</span>
          </button>
          <button
            onClick={() => navigate('/orders')}
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/orders'
                ? "text-orange-500"
                : "text-gray-500"
            }`}
          >
            <span className="text-xl mb-1"><BiSolidPurchaseTag /></span>
            <span className="text-xs">Orders</span>
          </button>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center p-2 ${
              showMoreMenu || location.pathname === '/coins' || 
              location.pathname === '/get-supplies' || 
              location.pathname === '/share-supplies'
                ? "text-orange-500"
                : "text-gray-500"
            }`}
          >
            <span className="text-xl mb-1"><BsThreeDots /></span>
            <span className="text-xs">More</span>
          </button>
        </div>
      </nav>

      {/* More Menu Dropdown */}
      <AnimatePresence>
        {showMoreMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed bottom-16 right-4 bg-white shadow-lg rounded-lg overflow-hidden z-20 min-w-[180px]"
          >
            <div className="py-1">
              <button
                onClick={() => {
                  navigate('/coins');
                  setShowMoreMenu(false);
                }}
                className={`w-full flex items-center px-4 py-3 ${
                  location.pathname === '/coins'
                    ? "text-orange-500 bg-orange-50 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg mr-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">Z</span>
                <span>Coins</span>
              </button>
              <button
                onClick={() => {
                  navigate('/share-supplies');
                  setShowMoreMenu(false);
                }}
                className={`w-full flex items-center px-4 py-3 ${
                  location.pathname === '/share-supplies'
                    ? "text-orange-500 bg-orange-50 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <img src="/src/assets/shareSup.png" alt="Share" className="w-5 h-5 mr-3" />
                <span>Share Supplies</span>
              </button>
              <button
                onClick={() => {
                  navigate('/get-supplies');
                  setShowMoreMenu(false);
                }}
                className={`w-full flex items-center px-4 py-3 ${
                  location.pathname === '/get-supplies'
                    ? "text-orange-500 bg-orange-50 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <img src="/src/assets/searchLove.png" alt="Get" className="w-5 h-5 mr-3" />
                <span>Get Supplies</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals and Overlays */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <LogoutConfirm
            showLogoutConfirm={showLogoutConfirm}
            setShowLogoutConfirm={setShowLogoutConfirm}
            handleLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      {showLocationPopup && (
        <LocationConfirm
          setShowLocationPopup={setShowLocationPopup}
          getLocationAndSetAddress={getLocationAndSetAddress}
        />
      )}

      <CartSnackbar />
      <Tooltip id="address-tooltip" />
    </div>
  );
};

export default UserLayout;