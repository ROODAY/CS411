require('dotenv').config();
require('./config/passport.js')(passport);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

var indexRouter = require('./routes/index')(app, express, passport);
var authRouter = require('./routes/auth')(app, express, passport);
var usersRouter = require('./routes/users')(app, express, passport);
var eventsRouter = require('./routes/events')(app, express, passport);
var eventRouter = require('./routes/event')(app, express, passport);
var zomatoRouter = require('./routes/zomato')(app, express, passport);

app.use('/', indexRouter);
app.use('/events', eventsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/event', eventRouter);
app.use('/zomato', zomatoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
