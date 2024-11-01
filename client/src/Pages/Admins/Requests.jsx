import { IoMdLogOut } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
const Requests = () => {
  return (
    <div className="pb-3 bg-gray-100 h-screen">
    <div className="flex bg-white justify-between border-b-2 p-3 items-center mb-6 ">
                <div className="relative w-1/3">
                    <input type="text" placeholder="Search" className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div>
                            <p className="font-semibold">Max</p>
                            <p className="text-sm text-gray-500">Admin</p>
                        </div>
                    </div>
                    <IoMdLogOut className="text-3xl" />
                </div>
            </div>
    <h1 className="text-2xl mx-3 font-bold mb-4">Vendors Request</h1>
    <div className="space-y-4">
        <div className="bg-white mx-3 p-4 rounded-lg shadow-md flex items-center">
            <img src="https://placehold.co/60x60" alt="Profile picture of Samuel Jack" className="w-16 h-16 rounded-full mr-4" />
            <div className="flex-1">
                <h2 className="text-xl font-bold">Samuel Jack</h2>
                <p className="text-gray-600">Metro Cafe</p>
                <p className="text-gray-600">samjac123@gmail.com</p>
            </div>
            <div className="flex space-x-2">
                <button className="font-semibold text-lg hover:bg-blue-600 transition-all duration-200 bg-blue-500 text-white px-4 py-2 rounded">View</button>
                <button className="font-semibold text-lg hover:bg-green-600 transition-all duration-200 bg-green-500 text-white px-4 py-2 rounded">Accept</button>
                <button className="font-semibold text-lg hover:bg-red-600 transition-all duration-200 bg-red-500 text-white px-4 py-2 rounded">Deny</button>
            </div>
        </div>
        <div className="bg-white mx-3 p-4 rounded-lg shadow-md flex items-center">
            <img src="https://placehold.co/60x60" alt="Profile picture of Kenny" className="w-16 h-16 rounded-full mr-4" />
            <div className="flex-1">
                <h2 className="text-xl font-bold">Kenny</h2>
                <p className="text-gray-600">Italian Cafe</p>
                <p className="text-gray-600">ken1892@gmail.com</p>
            </div>
            <div className="flex space-x-2">
                <button className="font-semibold text-lg hover:bg-blue-600 transition-all duration-200 bg-blue-500 text-white px-4 py-2 rounded">View</button>
                <button className="font-semibold text-lg hover:bg-green-600 transition-all duration-200 bg-green-500 text-white px-4 py-2 rounded">Accept</button>
                <button className="font-semibold text-lg hover:bg-red-600 transition-all duration-200 bg-red-500 text-white px-4 py-2 rounded">Deny</button>
            </div>
        </div>
    </div>
</div>
  )
}

export default Requests