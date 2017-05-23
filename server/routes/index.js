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

router.route('/users/:id')
	.get(admin.getUserById)
	.put(admin.updateUser)
	.delete(admin.deleteUser);

router.route('/subjects')
	.get(admin.getSubjects)
	.post(admin.insertSubject);

router.route('/subjects/:id')
	.get(admin.getSubjectById)
	.put(admin.updateSubject)
	.delete(admin.deleteSubject);

module.exports = router;