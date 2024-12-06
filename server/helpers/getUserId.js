const decodeToken = require('../utils/jwtDecoder');

const getUserId = (token, secret) => {
    const decoded = decodeToken(token, secret);
    return decoded && decoded.userId ? decoded.userId : null;
};

module.exports = getUserId;