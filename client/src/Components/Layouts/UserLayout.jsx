import { Tooltip } from 'react-tooltip'
import { LoadingScreen } from '../../Components/LoadingScreen';
import { LocationConfirm } from '../../Components/LocationConfirm';
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
import LogoutConfirm from "../../Components/LogoutConfirm";
import { Outlet } from 'react-router-dom';
import {setAddress,setCoordinates} from '../../Redux/slices/user/userLocationSlice'
import CartSnackbar from '../CartSnackbar';

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [userAddress, setUserAddress] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false);

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
    <div className="flex">
      <aside className="bg-gray-100 hide-scrollbar h-screen w-[18%] top-0 left-0 bottom-0 text-center shadow-lg flex flex-col justify-between overflow-y-auto">
        <div>
          <p className="text-5xl font-semibold mt-3 mb-5 text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text cursor-pointer">Zelova</p>
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
        <div className="mb-3 mx-4 mt-6  space-y-3">
          <div className="relative">
            <div className="relative">
              <div
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-4 cursor-pointer p-4 ${location.pathname === "/profile"
                    ? "bg-orange-400 hover:bg-orange-500"
                    : "bg-gray-200 hover:bg-gray-300"
                  } hover:scale-105 rounded-lg transition-all shadow-md`}
              >
                {userData?.profilePicture ? (
                  <img
                    referrerPolicy="no-referrer"
                    src={
                      profilePicture ||
                      "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg"
                    }
                    alt="Profile"
                    className="rounded-full w-12 h-12 border border-gray-300"
                  />
                ) : (
                  <FaUser className="text-3xl text-gray-600 bg-gray-300 p-2 rounded-full" />
                )}
                <div className="flex flex-col items-start w-[70%]">
                  <p
                    className={`font-semibold text-lg ${location.pathname === "/profile" ? "text-white" : "text-gray-700"
                      }`}
                  >
                    {userData?.fullname}
                  </p>
                  <p
                    onClick={() => setShowDropdown(!showDropdown)}
                    data-tooltip-id="address-tooltip"
                    data-tooltip-content={`${userAddress}`}
                    className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis ${location.pathname === "/profile" ? "text-orange-100" : "text-gray-500"
                      } w-full max-w-full`}
                  >
                    {userAddress || "Loading..."}
                  </p>
                </div>
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

      <main className="flex-1 h-screen overflow-y-auto">
        <Outlet />
        <CartSnackbar />
      </main>
      <AnimatePresence>
      {showLocationPopup && (
        <LocationConfirm
          setShowLocationPopup={setShowLocationPopup}
          getLocationAndSetAddress={getLocationAndSetAddress} />
      )}
      </AnimatePresence>
      <LogoutConfirm
        showLogoutConfirm={showLogoutConfirm}
        setShowLogoutConfirm={setShowLogoutConfirm}
        handleLogout={handleLogout}
      />
      <Tooltip id="address-tooltip" />
    </div>

  );
};

export default UserLayout;