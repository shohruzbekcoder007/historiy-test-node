const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(401).send('Token bo\'lmaganligi sababli murojaat rad etildi');

    try {
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        req.user = decoded;
        next();
    }
    catch (ex) {
        return res.status(400).send('Yaroqsiz token');
    }
}