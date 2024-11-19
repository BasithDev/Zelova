const jwt = require('jsonwebtoken');

const decodeToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error("Token decoding error:", error.message);
        return null;
    }
};

module.exports = decodeToken;