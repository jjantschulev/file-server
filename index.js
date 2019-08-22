require('dotenv').config();

// Require Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// Import Routes
const authRoute = require('./src/routes/auth');
const filesRoute = require('./src/routes/files');

// Create Express App
const app = express();

// Use Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Use API Routes
app.use('/api/auth', authRoute);
app.use('/api/files', filesRoute);

// Start the server
app.listen(process.env.PORT || 8080);
