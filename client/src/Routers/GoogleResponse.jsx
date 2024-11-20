import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GoogleResponse = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const statusFromQuery = query.get('status');
        setStatus(statusFromQuery);

        if (statusFromQuery === 'error') {
            toast.error("An error occurred during login. Please try again.");
        }
    }, []);

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <ToastContainer />
            {status === 'blocked' ? (
                <div className="p-6 bg-white border border-red-500 rounded-md shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Account Blocked</h2>
                    <p className="text-gray-700 mb-6">
                        Your account is blocked. Please contact support for further assistance.
                    </p>
                    <button
                        onClick={handleLoginRedirect}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            ) : status === 'error' ? (
                <div className="p-6 bg-white border border-yellow-500 rounded-md shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-yellow-600 mb-4">Error Occurred</h2>
                    <p className="text-gray-700 mb-6">
                        There was an error during login. Please try again later.
                    </p>
                    <button
                        onClick={handleLoginRedirect}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            ) : (
                <p className="text-gray-700 text-lg">Processing your request...</p>
            )}
        </div>
    );
};

export default GoogleResponse;