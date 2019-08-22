const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, async (req, res) => {
    try {
        res.send(req.username);
    } catch (error) {
        res.send({
            error: true,
            message: error.message,
        });
    }
});

module.exports = router;
