const decodeToken = require('../utils/jwtDecoder'); // Import your decoding utility

exports.getUserId = (token, secret) => {
    const decoded = decodeToken(token, secret);
    return decoded && decoded.userId ? decoded.userId : null;
};