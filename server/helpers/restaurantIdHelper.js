const decodeToken = require('../utils/jwtDecoder'); // Import your decoding utility

const getRestaurantId = (token, secret) => {
    const decoded = decodeToken(token, secret);
    return decoded && decoded.restaurantId ? decoded.restaurantId : null;
};

module.exports = getRestaurantId
