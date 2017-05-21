const express = require('express');
const router = express.Router();

const login = require('./api/login');
const admin = require('./api/admin');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.post('/login', (req, res) => {
	login.login;
});

router.post('/signup', (req, res) => {
	login.signup;
});

router.post('/users', (req, res) => {
	admin.getUsers;
});

module.exports = router;