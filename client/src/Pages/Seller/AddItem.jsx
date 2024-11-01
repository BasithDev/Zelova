import PrimaryBtn from '../../Components/Buttons/PrimaryBtn'
const AddItem = () => {
  return (
    <div className="min-h-screen bg-white px-8 py-6">
                    <h1 className="text-3xl font-bold mb-4">Add Items</h1>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-xl text-orange-500">Item Name</label>
                            <input type="text" className="w-full text-2xl p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-xl text-orange-500">Item Price</label>
                            <input type="text" className="w-full text-2xl  p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-xl text-orange-500">Item Offer Price</label>
                            <input type="text" className="w-full text-2xl  p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-xl text-orange-500">Item Offer Type</label>
                            <input type="text" className="w-full text-2xl  p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-xl text-orange-500">Item Description</label>
                            <input type="text" className="w-full text-2xl  p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-xl text-orange-500">Select item category</label>
                            <select className="w-full text-2xl p-2 border rounded-md">
                                <option value="">Select</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xl text-orange-500">Add item images</label>
                            <div className="flex space-x-2">
                                <img src="https://placehold.co/100x100" alt="A bowl of biryani" className="w-44 h-24 object-cover rounded-md" />
                                <div className="w-44 h-24 border rounded-md flex items-center justify-center text-2xl text-gray-400">
                                    +
                                </div>
                            </div>
                        </div>
                        <PrimaryBtn text="Add Item" onClick={()=>console.log("Logged")} className="py-2 px-4 font-semibold text-2xl"/>
                    </form>
                </div>
  )
}

export default AddItem