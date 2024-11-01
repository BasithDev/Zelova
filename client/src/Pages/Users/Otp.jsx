import PrimaryBtn from '../../Components/Buttons/PrimaryBtn'
import { motion } from 'framer-motion';
const Otp = () => {
    return (
        <div className="flex h-screen">
            <div className="bg-orange-200 w-[480px] flex items-center justify-center rounded-r-xl">
                <div className="text-9xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">Z</div>
            </div>
            <motion.div 
            className="bg-white w-2/3 p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            exit={{ opacity: 0}}
            transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-bold mb-2">OTP has sent to your mail ID</h1>
                <p className="mb-4 text-orange-400">Please Enter OTP to verify your account</p>
                <div className="flex items-center mb-4">
                    <div className="flex-1">
                        <input placeholder="Enter OTP here" className="w-1/4 border border-gray-300 rounded-lg p-2" type="text" id="otp" />
                        <p className="text-gray-500 mt-2">Resend after 59 seconds</p>
                    </div>
                </div>
                <div className="flex space-x-4">
                <PrimaryBtn text="Verify" onClick={()=>console.log("Logged")} className="bg-orange-400 hover:bg-orange-500 transition-all duration-200 text-white text-xl font-bold py-2 px-6 rounded-lg"/>
                <PrimaryBtn text="Resend" onClick={()=>console.log("Logged")} className="bg-orange-400 hover:bg-orange-500 transition-all duration-200 text-white text-xl font-bold py-2 px-6 rounded-lg"/>
                </div>
            </motion.div>
        </div>
    )
}

export default Otp