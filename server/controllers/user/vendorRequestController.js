const VendorRequest = require('../../models/vendorRequest')
const jwt = require('jsonwebtoken')
const statusCodes = require('../../config/statusCodes')

const submitReqVendor = async (req, res, next) => {
    try {
      const token = req.cookies.user_token || req.headers.authorization.split(' ')[1]; 
      if (!token) {
          return res.status(statusCodes.UNAUTHORIZED).json({ message: 'No token provided' });
      }
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
    
        res.status(statusCodes.CREATED).json({ message: 'Vendor request submitted successfully' });
      } catch (error) {
        console.error('Error in submitReqVendor:', error);
        next(error);
      }
}
module.exports= {
  submitReqVendor
}