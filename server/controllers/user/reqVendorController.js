const VendorRequest = require('../../models/vendorRequest')
exports.submitReqVendor = async (req,res)=>{
    try {
        const { restaurantName, address, description, license } = req.body;
        const newVendorRequest = new VendorRequest({
          userId: req.user.userId,
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