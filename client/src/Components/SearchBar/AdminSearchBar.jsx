import { FaBell, FaSearch, FaClipboardList, FaStoreAlt } from "react-icons/fa";
import { MdDashboard, MdShoppingBasket, MdLocalOffer, MdEmail } from 'react-icons/md';
import { LuUsers } from 'react-icons/lu';
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { getVendorPendingRequestsCount } from "../../Services/apiServices";
import { motion } from 'framer-motion';

const AdminSearchBar = () => {
  const adminData = useSelector((state) => state.adminData.data);
  const location = useLocation()
  const navigate = useNavigate()
  const [pendingRequests, setPendingRequests] = useState(0);
  const availablePages = useMemo(() => [
    'dashboard',
    'requests',
    'user-manage',
    'vendor-manage',
    'category-manage',
    'details',
    'coupon-manage',
    'send-mail'
  ], []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPages, setFilteredPages] = useState([]);

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
    const interval = setInterval(fetchPendingCount, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredPages(availablePages.filter(page => page.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setFilteredPages([]);
    }
  }, [availablePages, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageClick = (page) => {
    const route = page === 'dashboard' ? '/admin' : `/admin/${page}`;
    navigate(route);
    setSearchQuery('');
  };

  return (
    <div className="flex bg-white justify-between border-b-2 p-3 items-center mb-3">
      <div className="relative w-1/2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          {filteredPages.length > 0 ? (
            <motion.ul 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bg-white border border-gray-300 w-full mt-1 z-50 rounded-md shadow-lg">
              {filteredPages.map((page, index) => (
                <motion.li 
                  key={index} 
                  onClick={() => handlePageClick(page)} 
                  className="cursor-pointer hover:bg-gray-100 p-2 flex items-center">
                  {page === 'dashboard' && <MdDashboard className="mr-2 text-blue-500" />}
                  {page.includes('user') && <LuUsers className="mr-2 text-green-500" />}
                  {page.includes('vendor') && <FaStoreAlt className="mr-2 text-orange-500" />}
                  {page.includes('category') && <MdShoppingBasket className="mr-2 text-red-500" />}
                  {page.includes('details') && <FaClipboardList className="mr-2 text-purple-500" />}
                  {page.includes('coupon') && <MdLocalOffer className="mr-2 text-yellow-500" />}
                  {page.includes('mail') && <MdEmail className="mr-2 text-teal-500" />}
                  <span>{page.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            searchQuery && filteredPages.length === 0 && (
              <div className="absolute bg-white border border-gray-300 w-full mt-1 z-50 rounded-md shadow-lg p-2 text-center cursor-pointer hover:bg-gray-100" 
              onClick={() => handlePageClick('dashboard')}>
                Option not available, would you like to go to <span className="text-blue-500 font-bold">Dashboard</span>?
              </div>
            )
          )}
        </div>
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