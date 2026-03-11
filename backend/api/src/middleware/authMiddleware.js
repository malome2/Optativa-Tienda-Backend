const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Token no proporcionat' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCES_SECRET);
        req.usuariId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ status: 'error', message: 'Token invàlid o caducat' });
    }
};

module.exports = authMiddleware;