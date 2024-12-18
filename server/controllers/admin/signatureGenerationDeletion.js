const crypto = require('crypto');
const cloudinary = require('../../config/cloudinaryServiceConfig');
const statusCodes = require('../../config/statusCodes');

const generateDeleteSignature = (req, res) => {
    const { public_id, timestamp } = req.body;
    if (!public_id || !timestamp) {
      return res.status(statusCodes.BAD_REQUEST).json({ error: 'Missing required parameters.' });
    }
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=${public_id}&timestamp=${timestamp}${cloudinary.config().api_secret}`)
      .digest('hex');
    res.json({ signature, timestamp, public_id });
};

module.exports = {
  generateDeleteSignature
};