
const jwt = require('jsonwebtoken');

const verifyToken = (role) => (req, res, next) => {
    const tokenName = role === 'admin' ? 'admin_token' : 'user_token';
    const secret = role === 'admin' ? process.env.JWT_SECRET_ADMIN : process.env.JWT_SECRET;

    const token = req.cookies[tokenName];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = verifyToken;