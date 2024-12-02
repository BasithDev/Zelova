const decodeToken = require('../utils/jwtDecoder');

exports.getUserId = (token, secret) => {
    const decoded = decodeToken(token, secret);
    return decoded && decoded.userId ? decoded.userId : null;
};