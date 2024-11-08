const User = require('../../models/user')

exports.getVendors= async (req,res)=>{
try {
    const vendors = await User.find({ isVendor: true });
    res.status(200).json(vendors);
} catch (error) {
    res.status(500).json({ 
        status:"Failed",
        message: "Error retrieving vendors", error });
}
}