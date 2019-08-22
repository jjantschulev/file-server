const jwt = require('jsonwebtoken');
const { refreshAccessToken } = require('../utils/token');

const verifyToken = async (req, res, next) => {
    try {
        const accessToken = req.headers['x-access-token'];
        if (!accessToken) throw Error('No Access token provided');
        const result = await verifyAccessToken(accessToken);
        if (result.shouldRefresh === true) {
            const refreshToken = req.headers['x-refresh-token'];
            if (!refreshToken) throw Error('No refresh token provided');
            const accessToken = await refreshAccessToken(refreshToken);
            return res.send({
                error: true,
                type: 'new-access-token',
                data: accessToken,
            });
        } else {
            // eslint-disable-next-line require-atomic-updates
            req.username = result.username;
            next();
        }
    } catch (error) {
        res.send({
            error: true,
            type: 'token-error',
            message: error.message,
        });
    }
};

const verifyAccessToken = token =>
    new Promise((res, rej) =>
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res({ shouldRefresh: true });
                }
                rej(err);
            }
            res(decoded);
        })
    );

module.exports = verifyToken;
