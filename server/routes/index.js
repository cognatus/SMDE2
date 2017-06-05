const express = require('express');
const router = express.Router();

const _media =  'src/media/';

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

router.route('/subjects')
	.get(admin.getSubjects)
	.post(admin.insertSubject);

router.route('/subjects/:id')
	.get(admin.getSubjectById)
	.put(admin.updateSubject)
	.delete(admin.deleteSubject);

router.route('/groups')
	.get(admin.getGroups)
	.post(admin.insertGroup);

router.route('/groups/:id')
	.get(admin.getGroupById)
	.put(admin.updateGroup)
	.delete(admin.deleteGroup);

router.route('/courses')
	.get(admin.getCourses)
	.post(admin.insertCourses);

router.post('/updateProfilePhotos', profile.updateProfilePhotos);

module.exports = router;