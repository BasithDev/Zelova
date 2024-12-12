const jwt = require('jsonwebtoken');

const verifyToken = (role) => (req, res, next) => {
    // Check if request is from our frontend
    const origin = req.get('origin');
    const referer = req.get('referer');
    const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173'; // Your frontend URL

    // Block direct API access from browser
    if (!origin && !referer) {
        return res.status(403).json({ 
            success: false,
            message: 'Direct API access not allowed' 
        });
    }

    // Allow only requests from our frontend
    if (origin && !origin.startsWith(allowedOrigin)) {
        return res.status(403).json({ 
            success: false,
            message: 'Unauthorized origin' 
        });
    }

    const tokenName = role === 'admin' ? 'admin_token' : 'user_token';
    const token = req.cookies[tokenName];
    const secret = role === 'admin' ? process.env.JWT_ADMIN_SECRET : process.env.JWT_SECRET;

    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Authentication required.' 
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
            message: 'Invalid authentication token.' 
        });
    }
};

module.exports = { verifyToken };