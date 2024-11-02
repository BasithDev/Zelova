const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/admin')
exports.loginAdmin =async (req,res)=>{
    const {email,password} = req.body
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "No admin Found" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const payload = {
            adminId: admin._id,
        };
        const token = jwt.sign(payload, process.env.JWT_ADMIN_SECRET, { expiresIn: '1h' });
        res.cookie('admin_token', token, {
            maxAge: 3600000,
        });
        return res.status(200).json({ 
            status:"Success",
            message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status:"Failed",
            message: "Server error" });
    }
}