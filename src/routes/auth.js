const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../utils/db');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

router.post('/create-account', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate Input
        if (!password || !username)
            throw Error('Please Enter Username and Password');

        if (password.length < 8) throw Error('Password must be > 8 characters');

        // Check if username exists
        const user = await db.query('SELECT * FROM users WHERE username=$1', [
            username,
        ]);
        if (user.rowCount > 0) throw Error('Username already exists');

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 16);

        // Insert into DB
        await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            [username, hashedPassword]
        );

        // Generate Tokens
        const accessToken = await generateAccessToken(username);
        const refreshToken = await generateRefreshToken(username);

        res.send({
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.send({
            error: true,
            message: error.message,
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await db.single(
            'SELECT password FROM users WHERE username=$1',
            [username],
            'Username or password incorrect'
        );

        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) throw Error('Username or password incorrect');

        const accessToken = await generateAccessToken(username);
        const refreshToken = await generateRefreshToken(username);

        res.send({
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.send({
            error: true,
            message: error.message,
        });
    }
});

module.exports = router;
