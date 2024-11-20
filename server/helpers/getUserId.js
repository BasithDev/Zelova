const decodeToken = require('../utils/jwtDecoder'); // Import your decoding utility

const getRestaurantId = (token, secret) => {
    const decoded = decodeToken(token, secret);
    return decoded && decoded.userId ? decoded.userId : null;
};

module.exports = getRestaurantId;