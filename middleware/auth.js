const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).json({ msg: 'No token was provided to the server: Could not authorize' });

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        res.status(400).json({ msg: 'The authorisation token provided to the server was not valid: Could not authorize' });
    }
}

module.exports = auth;