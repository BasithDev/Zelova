import PrimaryBtn from '../../Components/Buttons/PrimaryBtn';

const AddItem = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto space-y-8">

                {/* Add Categories Section */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Add Food Categories & Offer</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Add New Food Subcategory */}
                        <div className="flex flex-col">
                            <label className="text-lg font-medium text-gray-700 mb-2">Add New Food Category</label>
                            <input
                                type="text"
                                className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter new category"
                            />
                            <PrimaryBtn
                                text="Add category"
                                onClick={() => console.log('Subcategory Added')}
                                className="mt-4 px-6 py-3 text-xl font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
                            />
                        </div>


                        {/* Add New Offer Type */}
                        <div className="flex flex-col">
                            <label className="text-lg font-medium text-gray-700 mb-2">Add New Offer Type</label>
                            <input
                                type="text"
                                className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter new offer"
                            />
                            <PrimaryBtn
                                text="Add Offer"
                                onClick={() => console.log('Offer Added')}
                                className="mt-4 px-6 py-3 text-xl font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Add Food Item Categories</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Add New Food Subcategory */}
                        <div className="flex flex-col">
                            <label className="text-lg font-medium text-gray-700 mb-2">Select Food Category</label>
                            <select
                                className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Select a option</option>
                                {/* Populate with dynamic subcategory options */}
                                <option value="subcategory1">Subcategory 1</option>
                                <option value="subcategory2">Subcategory 2</option>
                                <option value="subcategory3">Subcategory 3</option>
                                {/* Add more options dynamically based on available categories */}
                            </select>
                        </div>


                        <div className="flex flex-col">
                            <label className="text-lg font-medium text-gray-700 mb-2">Add New Food Item category</label>
                            <input
                                type="text"
                                className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter new item category"
                            />

                        </div>
                    </div>
                    <PrimaryBtn 
                text="Add Item category" 
                onClick={() => console.log('Subcategory Added')} 
                className="mt-4 px-6 py-3 text-xl font-semibold w-full text-white bg-orange-500 rounded-md hover:bg-orange-600"
              />
                </div>

                {/* Add Food Item Section */}
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Add New Food Item</h3>

                <form className="space-y-8">
                    {/* Select Food Subcategory */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Select Food Item category</label>
                        <select
                            className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">Select a option</option>
                            {/* Existing subcategories could be listed here */}
                        </select>
                    </div>

                    {/* Item Name */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Item Name</label>
                        <input
                            type="text"
                            className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter item name"
                        />
                    </div>

                    {/* Item Images */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Add Item Images</label>
                        <div className="flex space-x-4 mt-4">
                            <div className="w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                                <img src="https://placehold.co/100x100" alt="Example Image" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-32 h-32 border border-gray-300 rounded-md flex items-center justify-center text-2xl text-gray-400 cursor-pointer">
                                <input type="file" className="hidden" id="image-upload" />
                                <label htmlFor="image-upload" className="cursor-pointer">+</label>
                            </div>
                        </div>
                    </div>

                    {/* Item Price */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Item Price</label>
                        <input
                            type="text"
                            className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter item price"
                        />
                    </div>

                    {/* Item Offer Price */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Item Offer Price</label>
                        <input
                            type="text"
                            className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter offer price"
                        />
                    </div>

                    {/* Item Offer Type */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Select Offer Type</label>
                        <select
                            className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">Select Offer</option>
                            {/* Existing offer types could be listed here */}
                        </select>
                    </div>

                    {/* Item Description */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Item Description</label>
                        <textarea
                            className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            rows="4"
                            placeholder="Enter item description"
                        ></textarea>
                    </div>


                    {/* Add Item Button */}
                    <div className="flex justify-center">
                        <PrimaryBtn
                            text="Add Item"
                            onClick={() => console.log('Item Added')}
                            className="py-3 px-8 text-xl font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItem;