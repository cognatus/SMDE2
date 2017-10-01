const express = require('express');
const router = express.Router();
const validation = require('./_validation');

const login = require('./api/login');
const admin = require('./api/admin');
const notif = require('./api/notificaciones');
const profile = require('./api/perfil');
const courses = require('./api/cursos');
const groups = require('./api/grupos');

/* GET api listing. */
router.get('/', (req, res) => {
	res.send('api works');
});

router.post('/login', validation.LOGIN, validation.result, login.login);

router.post('/signup', login.signup);

router.route('/users')
	.get(validation.AUTH, admin.getUsers)
	.post(validation.AUTH, admin.insertUser);

router.route('/users/:id')
	.get(validation.AUTH, admin.getUserById)
	.put(validation.AUTH, admin.updateUser)
	.delete(validation.AUTH, admin.deleteUser);

router.route('/profile')
	.post(validation.AUTH, profile.uploadProfilePhotos)
	.put(validation.AUTH, profile.updatePhoto)
	.delete(validation.AUTH, profile.deletePhoto);

router.route('/notif')
	.get(validation.AUTH, notif.getNotifications);

router.route('/notif/:id')
	.put(validation.AUTH, notif.updateNotifStatus);

router.route('/courses')
	.get(courses.getCourses)
	.post(courses.insertCourse);

router.route('/courses/:id')
	.get(courses.getCourseById)
	.put(validation.AUTH, courses.updateCourse)
	.delete(validation.AUTH, courses.deleteCourse);

router.route('/courses/:id/suscribe')
	.post(validation.AUTH, courses.suscribeUser)
	.delete(validation.AUTH, courses.unsuscribeUser);

router.route('/courses/:id/content')
	.post(validation.AUTH, courses.createContent)

router.route('/courses/:id/group')
	.post(validation.AUTH, groups.createGroup)

router.route('/courses/:id/group/:groupid')
	.put(validation.AUTH, groups.updateGroup)
	.delete(validation.AUTH, groups.deleteGroup);

module.exports = router;