import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate,useLocation } from "react-router-dom";
const AdminSearchBar = () => {
  const location = useLocation()
    const navigate = useNavigate()
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
          <FaBell 
          onClick={()=>navigate('/admin/requests')}
          className={`text-yellow-500 ${location.pathname === '/admin/requests' ? 'bg-blue-500' : 'hover:bg-blue-400'} cursor-pointer transition-all duration-200 text-4xl p-2 rounded-full`} />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div>
              <p className="font-semibold">Max</p>
              <p className="text-sm text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default AdminSearchBar