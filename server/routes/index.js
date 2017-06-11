const express = require('express');
const router = express.Router();

const login = require('./api/login');
const admin = require('./api/admin');
const profile = require('./api/perfil');

/* GET api listing. */
router.get('/', (req, res) => {
	res.send('api works');
});

router.post('/login', login.login);

router.post('/signup', login.signup);

router.route('/users')
	.get(admin.getUsers)
	.post(admin.insertUser);

router.route('/users/:id')
	.get(admin.getUserById)
	.put(admin.updateUser)
	.delete(admin.deleteUser);

router.route('/courses')
	.get(admin.getCourses)
	.post(admin.insertCourses);

router.route('/courses/:id')
	.get(admin.getCourseById);

router.route('/profile')
	.post(profile.uploadProfilePhotos)
	.put(profile.updatePhoto)
	.delete(profile.deletePhoto);

module.exports = router;