const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
    return (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({ error: 'Access denied. No token provided.' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
            req.user = decoded;

            if (roles.length > 0 && !roles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
            }

            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token.' });
        }
    };
};

module.exports = auth;
