const jwt = require('../utils/jwt');

const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
};

module.exports = auth;
