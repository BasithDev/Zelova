import { Outlet } from "react-router-dom"
import { MdHome } from "react-icons/md";
import { FaHeart, FaUser } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { IoMdLogOut } from "react-icons/io";
const UserLayout = () => {
    return (
        <div className="flex">
            <aside className="w-1/5 border-r-2 h-screen text-center">
                <p className="text-5xl font-semibold my-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 cursor-pointer">
                    Zelova
                </p>
                <div className="flex cursor-pointer items-center gap-2 bg-gray-200 rounded-md my-4 mx-4 px-3 py-1 hover:bg-gray-300 transition-all">
                    <MdHome className="text-3xl text-gray-500" />
                    <p className="text-3xl font-semibold text-gray-500">Home</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 bg-gray-200 rounded-md my-4 mx-4 px-3 py-1 hover:bg-gray-300 transition-all">
                    <FaHeart className="text-2xl text-gray-500" />
                    <p className="text-3xl font-semibold text-gray-500">Favourites</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 bg-gray-200 rounded-md my-4 mx-4 px-3 py-1 hover:bg-gray-300 transition-all">
                    <BiSolidPurchaseTag className="text-2xl text-gray-500" />
                    <p className="text-3xl font-semibold text-gray-500">Orders</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 bg-gray-200 rounded-md my-4 mx-4 px-3 py-1 hover:bg-gray-300 transition-all">
                    <p className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">Z</p>
                    <p className="text-3xl font-semibold text-gray-500">Coins</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 bg-gray-200 rounded-md my-4 mx-4 px-3 py-1 hover:bg-gray-300 transition-all">
                    <img src="/src/assets/shareSup.png" alt="" className="w-6" />
                    <p className="text-2xl font-semibold text-gray-500">Share Supplies</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 bg-gray-200 rounded-md my-4 mx-4 px-3 py-1 hover:bg-gray-300 transition-all">
                    <img src="/src/assets/searchLove.png" alt="" className="w-6" />
                    <p className="text-2xl font-semibold text-gray-500">Get Supplies</p>
                </div>

                <div className="flex bottom-0 absolute mb-2 items-center mx-4 gap-2">
                    <FaUser className="text-4xl bg-gray-400 p-1 rounded-full"/>
                    <p className="font-semibold text-2xl">Abdul Basith</p>
                    <IoMdLogOut className="text-3xl" />
                </div>
            </aside>

            <main className="w-full">
                <Outlet />
            </main>
        </div>
    )
}

export default UserLayout