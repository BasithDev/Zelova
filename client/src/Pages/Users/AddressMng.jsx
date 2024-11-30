import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { addAddress, getAddresses, deleteAddress, updateAddress } from "../../Services/apiServices";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddressMng = () => {
    const [addresses, setAddresses] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newAddress, setNewAddress] = useState({
        label: "",
        address: "",
        phone: "",
    });

    const fetchAddresses = async () => {
        try {
            const response = await getAddresses();
            setAddresses(response.data.addresses);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleAddAddress = async () => {
        if (newAddress.label && newAddress.address && newAddress.phone) {
            try {
                const response = await addAddress(newAddress);
                setAddresses([...addresses, response.data.address]);
                setNewAddress({ label: "", address: "", phone: "" });
                setIsAdding(false);
                toast.success('New Address Added!')
            } catch (error) {
                console.error("Error adding address:", error);
                toast.error('Failed to add address. Please try again.');
            }
        } else {
            toast.error('Please fill in all fields');
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            await deleteAddress(id);
            setAddresses(addresses.filter((address) => address._id !== id));
            toast.success('Address deleted successfully!');
        } catch (error) {
            console.error("Error deleting address:", error);
            toast.error('Failed to delete address. Please try again.');
        }
    };

    const handleEditClick = (address) => {
        setNewAddress({
            label: address.label,
            address: address.address,
            phone: address.phone,
        });
        setEditingId(address._id);
        setIsEditing(true);
        setIsAdding(true);
    };

    const handleUpdateAddress = async () => {
        if (newAddress.label && newAddress.address && newAddress.phone) {
            try {
                await updateAddress(editingId, newAddress);
                const updatedAddresses = addresses.map(addr => 
                    addr._id === editingId 
                        ? { ...addr, ...newAddress }
                        : addr
                );
                setAddresses(updatedAddresses);
                setNewAddress({ label: "", address: "", phone: "" });
                setIsAdding(false);
                setIsEditing(false);
                setEditingId(null);
                toast.success('Address updated successfully!');
            } catch (error) {
                console.error("Error updating address:", error);
                toast.error('Failed to update address. Please try again.');
            }
        } else {
            toast.error('Please fill in all fields');
        }
    };

    const handleCancel = () => {
        setNewAddress({ label: "", address: "", phone: "" });
        setIsAdding(false);
        setIsEditing(false);
        setEditingId(null);
    };
    
    return (
        <div className="relative flex flex-col md:flex-row p-6 gap-6 min-h-screen bg-gray-50">
            <ToastContainer position="top-right" />
            <div className="w-[57%]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-6 rounded-lg shadow-md"
                >
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Saved Addresses
                    </h2>
                    {addresses?.length > 0 ? (
                        <ul className="space-y-4">
                            {addresses.map((address) => (
                                <li
                                    key={address._id}
                                    className="relative cursor-pointer p-4 border rounded-md bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all"
                                >
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={() => handleEditClick(address)}
                                            className="text-blue-600 bg-gray-100 p-3 rounded-full shadow hover:bg-blue-100 hover:text-blue-700 transition-all focus:outline-none focus:ring focus:ring-blue-300"
                                        >
                                            <FiEdit2 className="text-xl" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(address._id)}
                                            className="text-red-600 bg-gray-100 p-3 rounded-full shadow hover:bg-red-100 hover:text-red-700 transition-all focus:outline-none focus:ring focus:ring-red-300"
                                        >
                                            <FiTrash2 className="text-xl" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-2 pr-24">
                                        <span className="font-medium text-gray-900">{address.label}</span>
                                        <p className="text-sm text-gray-700">Address : {address.address}</p>
                                        <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No addresses saved yet.</p>
                    )}
                </motion.div>
            </div>

            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: isAdding ? 0 : "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-white shadow-xl p-6 overflow-auto z-10"
            >
                <h2 className="text-2xl font-bold mb-4 text-blue-500">
                    {isEditing ? 'Edit Address' : 'Add New Address'}
                </h2>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Label
                    </label>
                    <input
                        type="text"
                        value={newAddress.label}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, label: e.target.value })
                        }
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="e.g., Home, Office"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <textarea
                        value={newAddress.address}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, address: e.target.value })
                        }
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Enter your address"
                        rows="4"
                    ></textarea>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        value={newAddress.phone}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, phone: e.target.value })
                        }
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Enter your phone number"
                    />
                </div>
                <button
                    onClick={isEditing ? handleUpdateAddress : handleAddAddress}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <FiPlus className="text-lg" />
                    {isEditing ? 'Update Address' : 'Add Address'}
                </button>
                <button
                    onClick={handleCancel}
                    className="w-full mt-4 flex items-center justify-center gap-2 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Cancel
                </button>
            </motion.div>

            {!isAdding && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAdding(true)}
                    className="fixed bottom-8 right-8 bg-blue-500 text-white py-2 px-3 text-xl font-semibold rounded-md shadow-lg hover:bg-blue-600 transition-colors z-10"
                >
                    New Address
                </motion.button>
            )}
        </div>
    );
};

export default AddressMng;