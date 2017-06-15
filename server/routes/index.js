const express = require('express');
const router = express.Router();

const login = require('./api/login');
const admin = require('./api/admin');
const profile = require('./api/perfil');
const courses = require('./api/cursos');

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

router.route('/profile')
	.post(profile.uploadProfilePhotos)
	.put(profile.updatePhoto)
	.delete(profile.deletePhoto);

router.route('/courses')
	.get(courses.getCourses)
	.post(courses.insertCourse);

router.route('/courses/:id')
	.get(courses.getCourseById)
	.put(courses.updateCourse)
	.delete(courses.deleteCourse);

router.route('/courses/:id/suscribe')
	.post(courses.suscribeUser)
	.delete(courses.unsuscribeUser);

router.route('/courses/:id/updategroup')
	.post(courses.createGroup)

router.route('/courses/:id/updategroup/:groupid')
	.put(courses.updateGroup)
	.delete(courses.deleteGroup);

module.exports = router;