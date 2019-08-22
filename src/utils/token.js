const jwt = require('jsonwebtoken');
const db = require('./db');

async function generateAccessToken(username) {
    const accessToken = await jwt.sign(
        {
            username,
            type: 'access',
        },
        process.env.JWT_SECRET,
        {
            expiresIn: 300,
        }
    );
    return accessToken;
}

async function generateRefreshToken(username) {
    const refreshToken = await jwt.sign(
        {
            username,
            type: 'refresh',
        },
        process.env.JWT_SECRET,
        {
            expiresIn: 3600,
        }
    );
    return refreshToken;
}

async function refreshAccessToken(refreshToken) {
    const { username, type } = await jwt.verify(
        refreshToken,
        process.env.JWT_SECRET
    );
    if (type !== 'refresh') throw Error('Not a refresh token');
    await db.single(
        'SELECT * FROM users WHERE username=$1',
        [username],
        'User not found'
    );
    const accessToken = generateAccessToken(username);
    return accessToken;
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    refreshAccessToken,
};
