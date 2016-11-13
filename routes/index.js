var express = require('express');
var app = express();
var router = express.Router();

var post = require('../api/post');

/* GET home page. */

// Middleware para usar en todas las peticiones
router.use(function(req, res, next) {
	console.log('Peticion a api');
	next();
});

router.get('/', function(req, res) {
    res.json({ message: 'Bienvenido a SMDE prro' });   
});

router.route('/users')
	.get(post.getUsers);

module.exports = router;
