const jwt = require('jsonwebtoken');

const decodeToken = (token, secret) => {
    if (token) {
        try {
            return jwt.verify(token, secret);
        } catch (error) {
            console.error("Token decoding error:", error.message);
            return null;
        } 
    }else{
        console.log('token expired or is not available')
        return null
    }
    
};

module.exports = decodeToken