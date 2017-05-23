const express = require('express');
const router = express.Router();

const login = require('./api/login');
const admin = require('./api/admin');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.post('/login', login.login);

router.post('/signup', login.signup);

router.get('/users', admin.getUsers);

module.exports = router;