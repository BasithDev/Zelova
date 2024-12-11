import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getVendorPendingRequestsCount } from "../../Services/apiServices";

const AdminSearchBar = () => {
  const adminData = useSelector((state) => state.adminData.data);
  const location = useLocation()
    const navigate = useNavigate()
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await getVendorPendingRequestsCount();
        setPendingRequests(response.data.count);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-white justify-between border-b-2 p-3 items-center mb-3">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
          <FaBell 
          onClick={()=>navigate('/admin/requests')}
          className={`text-yellow-500 ${location.pathname === '/admin/requests' ? 'bg-blue-500' : 'hover:bg-blue-400'} cursor-pointer transition-all duration-200 text-4xl p-2 rounded-full`}
          />
          {pendingRequests > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {pendingRequests}
            </span>
          )}
          </div>
          <div className="flex items-center space-x-2">
            <div>
              <p className="font-semibold text-xl">{adminData?.fullname || "admin name"}</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default AdminSearchBar