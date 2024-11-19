const VendorRequest = require('../../models/vendorRequest')
const jwt = require('jsonwebtoken')
exports.submitReqVendor = async (req,res)=>{
    try {
      const token = req.cookies.user_token || req.headers.authorization.split(' ')[1]; // Check for token in cookies or Authorization header

      if (!token) {
          return res.status(401).json({ message: 'No token provided' });
      }

      // Decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
        const { restaurantName, address, description, license } = req.body;
        const newVendorRequest = new VendorRequest({
          userId,
          restaurantName,
          address,
          description,
          license,
          status: 'pending',
        });
        await newVendorRequest.save();
    
        res.status(201).json({ message: 'Vendor request submitted successfully' });
      } catch (error) {
        console.error('Error in submitReqVendor:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}