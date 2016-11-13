var express = require('express');
var path = require('path');
var mysql = require('mysql');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon')

var app = express();

var jwt = require('express-jwt');
var cors = require('cors');

app.use(cors());

var api = require('./routes/index');
var users = require('./routes/users');

var post = require('./api/post');
var agenda = require('./api/agenda');
var perfil = require('./api/perfil');
var asignaturas = require('./api/asignaturas');
var mensajes = require('./api/mensajes');
var foro = require('./api/foro');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//this is like the public stuff, all about views
app.use(express.static(path.join(__dirname, 'angular')));
app.use(favicon(__dirname + '/icon.png'));

app.use('/api', api);
app.use('/users', users);

// Conecta a la DB MySQL
//de ahora en adelante para todo jalas la variable connection
var connection = mysql.createConnection({
  multipleStatements: true,
  host: 'localhost',
  password: 'n0m3l0',
  user: 'root',
  database: 'smdedbv1',
  port: 3306
});
//con esto conectas y lo ahce de manera asincrona
connection.connect(function(error){
  if(error){
    throw error;
  }else{
    console.log('Conexion correcta.');
  }
});

//por el momento dejalo así, sin embargo se va a remover ya que no es buena practica
post.constructor(connection);
perfil.constructor(connection);
agenda.constructor(connection);
asignaturas.constructor(connection);
mensajes.constructor(connection);
foro.constructor(connection);

/*
  Esta wea es para poder auntentificar con Angular 2
*/
// Authentication middleware provided by express-jwt.
// This middleware will check incoming requests for a valid
// JWT on any routes that it is applied to.
var authCheck = jwt({
  secret: new Buffer('YOUR_AUTH0_SECRET', 'base64'),
  audience: 'YOUR_AUTH0_CLIENT_ID'
});


// Detectar error 404 (Esto se hace directamente con Angular 2)
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
