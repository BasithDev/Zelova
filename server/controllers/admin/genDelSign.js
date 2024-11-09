const crypto = require('crypto');
const cloudinary = require('../../config/cloudinaryConfig');
exports.generateDeleteSignature = (req, res) => {
    const { public_id, timestamp } = req.body;
    if (!public_id || !timestamp) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=${public_id}&timestamp=${timestamp}${cloudinary.config().api_secret}`)
      .digest('hex');
    res.json({ signature, timestamp, public_id });
  }