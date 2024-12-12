const jwt = require('jsonwebtoken');

// Global API protection middleware
const protectApi = (req, res, next) => {
    // 1. Check request origin and headers
    const origin = req.get('origin');
    const xRequestedWith = req.get('X-Requested-With');
    const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

    // 2. Block if not XMLHttpRequest
    if (xRequestedWith !== 'XMLHttpRequest') {
        return res.status(403).json({
            success: false,
            message: 'Direct API access not allowed'
        });
    }

    // 3. Validate origin in production only
    if (origin && !origin.startsWith(allowedOrigin)) {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized origin'
        });
    }

    // 4. Check for custom application header
    const appToken = req.get('X-App-Token');
    if (!appToken || appToken !== process.env.APP_SECRET) {
        return res.status(403).json({
            success: false,
            message: 'Invalid application token'
        });
    }

    next();
};

// Role-based authentication middleware
const verifyToken = (role) => (req, res, next) => {
    const tokenName = role === 'admin' ? 'admin_token' : 'user_token';
    const secret = role === 'admin' ? process.env.JWT_ADMIN_SECRET : process.env.JWT_SECRET;
    const token = req.cookies[tokenName];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = { verifyToken, protectApi };