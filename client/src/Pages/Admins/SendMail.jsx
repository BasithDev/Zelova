import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from "react-toastify";
import AdminSearchBar from "../../Components/SearchBar/AdminSearchBar";
import { sendMail } from "../../Services/apiServices";
import { BeatLoader } from 'react-spinners';

const SendMail = () => {
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async () => {
        // Validate form
        if (!formData.to || !formData.subject || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await sendMail({
                email: formData.to,
                subject: formData.subject,
                message: formData.message
            });

            if (response.data.status === 'Success') {
                toast.success('Email sent successfully');
                handleClear(); // Clear form after successful send
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send email');
        } finally {
            setLoading(false);
        }
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
                            disabled={loading}
                            className={`w-full p-3 border mt-2 border-gray-300 rounded-lg bg-gray-50/50 focus:outline-none focus:border-blue-500 transition-all duration-300 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                            disabled={loading}
                            className={`w-full p-3 border mt-2 border-gray-300 rounded-lg bg-gray-50/50 focus:outline-none focus:border-blue-500 transition-all duration-300 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="font-semibold text-3xl">Message :</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Enter Message"
                            disabled={loading}
                            className={`w-full p-3 border mt-2 border-gray-300 rounded-lg bg-gray-50/50 focus:outline-none focus:border-blue-500 transition-all duration-300 h-40 resize-none ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={loading}
                            className={`bg-gray-200 font-bold hover:bg-gray-300 text-gray-500 px-5 py-2 rounded-lg mr-3 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center justify-center min-w-[100px] ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {loading ? <BeatLoader size={8} color="#ffffff" /> : 'Send Mail'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SendMail;