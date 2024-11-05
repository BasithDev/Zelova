import { Outlet, useNavigate } from "react-router-dom"
import { LuUsers } from "react-icons/lu";
import { MdDashboard } from "react-icons/md";

const AdminLayout = () => {
  const navigate = useNavigate()
  return (
    <div className="flex">
    <aside className="w-1/5 fixed border-r-2 h-screen p-2">
      <div className="text-center">
        <p className="text-orange-400 font-bold text-3xl">Zelova <span className="text-blue-500 text-xl">Admin</span></p>
      </div>
      <div 
      onClick={()=>navigate('/admin')}
      className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-md mt-3 cursor-pointer">
        <MdDashboard className="text-3xl" />
        <p className="text-3xl font-semibold">Dashboard</p>
      </div>
      <div
      onClick={()=>navigate('/admin/user-manage')}
      className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Users</p>
      </div>
      <div 
      onClick={()=>navigate('/admin/vendor-manage')}
      className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Vendors</p>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Items</p>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Details</p>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Coupon</p>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Send Mail</p>
      </div>
      <div 
      onClick={()=>navigate('/admin/profile')}
      className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Profile</p>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-200 cursor-pointer rounded-md mt-3">
        <LuUsers className="text-3xl" />
        <p className="text-3xl font-semibold">Logout</p>
      </div>
      
    </aside>

    <main className="ml-[20%] w-4/5">
      <Outlet/>
    </main>
    </div>

  )
}

export default AdminLayout