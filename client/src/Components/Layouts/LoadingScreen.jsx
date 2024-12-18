import { motion } from 'framer-motion';
import {ClipLoader} from 'react-spinners'
export function LoadingScreen() {
  return <motion.div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-400 to-red-500" initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }}>
      <motion.div className="flex flex-col items-center" initial={{
      scale: 0.8,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} transition={{
      duration: 0.5
    }}>
        <ClipLoader color="#fff" size={70} />
        <p className="mt-5 text-lg font-medium text-white animate-pulse">
          Loading, please wait...
        </p>
      </motion.div>
    </motion.div>;
}
  