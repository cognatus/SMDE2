// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

const app = express();

// Get our API routes
const api = require('./server/routes/index');

process.env.SECRET_KEY = "cl4v3bi3nch1ng0n4c41n4l";

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

global.__media = __dirname + 'media';

//conexion con mongo
mongoose.connect('mongodb://localhost/smde2', (error) => {
	if (error) {
		throw error;
	}else{
		console.log('CONECTADO A MONGO');
	}
});

app.use(morgan('tiny'));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));