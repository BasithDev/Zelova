const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const token = req.cookies.admin_token;
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = verifyToken;