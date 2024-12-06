import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer } from "react-toastify";
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";

const SendMail = () => {
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleClear = () => {
        setFormData({ to: '', subject: '', message: '' });
    };

    return (
        <div className="h-full bg-slate-100">
            <ToastContainer position="top-right" autoClose={2000} />
            <AdminSearchBar />
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 mx-24 bg-white rounded-xl shadow-2xl"
            >
                <h2 className="text-3xl font-bold mb-8 text-center">Send Mail</h2>
                <div className="grid grid-cols-1 gap-6">
                    <div className="mb-4">
                        <label className="font-semibold text-3xl">To :</label>
                        <input
                            type="email"
                            name="to"
                            value={formData.to}
                            onChange={handleChange}
                            placeholder="Enter Email Address"
                            className="w-full p-3 border mt-2 border-gray-600 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold text-3xl">Subject :</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Enter Subject"
                            className="w-full p-3 border mt-2 border-gray-600 rounded-lg"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="font-semibold text-3xl">Message :</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Enter Message"
                            className="w-full p-3 border mt-2 border-gray-600 rounded-lg h-40"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg mr-3"
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
                        >
                            Send Mail
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SendMail;