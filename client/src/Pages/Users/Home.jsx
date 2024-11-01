import SearchBar from "../../Components/SearchBar/SearchBar"
import { FaSort } from "react-icons/fa";
import PrimaryBtn from '../../Components/Buttons/PrimaryBtn'
const Home = () => {
    return (
        <>
            <div className="flex items-center gap-2 p-4 w-full">
                <SearchBar text={'foods , restuarnt and more...'}/>
                <div className="bg-orange-500 flex items-center justify-center rounded-md p-2 cursor-pointer hover:bg-orange-600 transition duration-300">
                    <FaSort className="text-white text-3xl" />
                </div>
                <PrimaryBtn text="Login" onClick={()=>console.log("Logged")} className="py-2 px-3 font-bold text-2xl"/>
            </div>
        </>
    )
}

export default Home