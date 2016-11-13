var express = require('express');
var path = require('path');
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

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//this is like the public stuff, all about views
app.use(express.static(path.join(__dirname, 'angular')));
app.use(favicon(__dirname + '/icon.png'));

app.use('/api', api);
app.use('/users', users);

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
