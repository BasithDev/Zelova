import { Outlet } from "react-router-dom"

const VendorLayout = () => {
  return (
    <div className="flex">
      <div className="flex items-center flex-col w-1/5 border-r-2 p-4">

        <div className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
          <p>Zelova <span className=" text-lg text-orange-300">Business</span></p>
        </div>

        <div className="mt-8 w-full space-y-4">
          <button className="flex items-center w-full p-3 text-white text-2xl font-bold bg-orange-400 rounded-lg hover:bg-orange-500 transition duration-200">
            <i className="fas fa-home mr-2"></i> Home
          </button>
          <button className="flex items-center w-full p-3 text-gray-600 text-2xl font-semibold bg-gray-100 border border-purple-300 rounded-lg hover:bg-gray-200 transition duration-200">
            <i className="fas fa-shopping-basket mr-2"></i> Orders
          </button>
          <button className="flex items-center w-full p-3 text-gray-600 text-2xl font-semibold bg-gray-100 border border-purple-300 rounded-lg hover:bg-gray-200 transition duration-200">
            <i className="fas fa-hotel mr-2"></i> Manage Hotel
          </button>
          <button className="flex items-center w-full p-3 text-gray-600 text-2xl font-semibold bg-gray-100 border border-purple-300 rounded-lg hover:bg-gray-200 transition duration-200">
            <i className="fas fa-plus-square mr-2"></i> Add Items
          </button>
          <button className="flex items-center w-full p-3 text-gray-600 text-2xl font-semibold bg-gray-100 border border-purple-300 rounded-lg hover:bg-gray-200 transition duration-200">
            <i className="fas fa-box-open mr-2"></i> Products
          </button>
          <button className="flex items-center w-full p-3 text-gray-600 text-2xl font-semibold bg-gray-100 border border-purple-300 rounded-lg hover:bg-gray-200 transition duration-200">
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </div>
      </div>

      <main className="w-4/5">
        <Outlet />
      </main>
    </div>
  )
}

export default VendorLayout