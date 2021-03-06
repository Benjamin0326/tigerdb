var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var notice = require('./routes/notice');
var phone = require('./routes/phone');
var people = require('./routes/people');
var schedule = require('./routes/schedule');
var bug = require('./routes/bug');
var rent = require('./routes/rent');
var usim = require('./routes/usim');
var test = require('./routes/test');
var job = require('./routes/job');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  key: 'sid',
  secret: '0305',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/users', users);
app.use('/notice', notice);
app.use('/phone', phone);
app.use('/schedule', schedule);
app.use('/people', people);
app.use('/bug', bug);
app.use('/rent', rent);
app.use('/usim', usim);
app.use('/test', test);
app.use('/job', job);
//app.use('/usim', usim);
//app.use('/notices', notices);


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

var server = app.listen(app.get('port'), function(){
  console.log('open');
});
