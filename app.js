var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var firebase = require("firebase");
// var config = {
// apiKey: "AIzaSyB9AlUSHv5-aolUxiSMgS7Ww2MPX-TkjPE",
// authDomain: "resolutions-60535.firebaseapp.com",
// databaseURL: "https://resolutions-60535.firebaseio.com",
// storageBucket: "resolutions-60535.appspot.com",
// messagingSenderId: "836383949069"
// };
// firebase.initializeApp(config);
var stormpath = require('stormpath');
var app = express();

var mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/referral'
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl, function(err) {
  console.log(err || `Connected to MongoDB: ${mongoUrl}`);
});

var apiKey = new stormpath.ApiKey(
  process.env['STORMPATH_CLIENT_APIKEY_ID'],
  process.env['STORMPATH_CLIENT_APIKEY_SECRET']
);

var client = new stormpath.Client({ apiKey: apiKey });

var applicationHref = process.env['STORMPATH_APPLICATION_HREF'];

client.getApplication(applicationHref, function(err, application) {
  console.log('Application:', application);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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