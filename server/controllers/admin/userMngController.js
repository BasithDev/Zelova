const User = require('../../models/user')

exports.getUsers= async (req,res)=>{
try {
    const users = await User.find({ isVendor: false });
    res.status(200).json(users);
} catch (error) {
    res.status(500).json({ 
        status:"Failed",
        message: "Error retrieving users", error });
}
}