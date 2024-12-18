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
        <div className="min-h-screen bg-gray-50">
            <AdminSearchBar />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto p-6"
            >
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Email</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
                                Recipient Email
                            </label>
                            <input
                                type="email"
                                id="to"
                                name="to"
                                value={formData.to}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Enter recipient's email"
                            />
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Enter email subject"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="6"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                                placeholder="Enter your message"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <BeatLoader size={8} color="#ffffff" />
                                ) : (
                                    'Send Email'
                                )}
                            </button>
                            <button
                                onClick={handleClear}
                                disabled={loading}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default SendMail;