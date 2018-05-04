// Load Environment Variables and setup Passport.js
require('dotenv').config();
require('./config/passport.js')(passport);

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const hbs = require('hbs');
const favicon = require('serve-favicon');

var app = express();

// view engine setup
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','fav','favicon.ico')));
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// initialize routers
const indexRouter = require('./routes/index')(app, express, passport);
const authRouter = require('./routes/auth')(app, express, passport);
const usersRouter = require('./routes/users')(app, express, passport);
const eventsRouter = require('./routes/events')(app, express, passport);
const zomatoRouter = require('./routes/zomato')(app, express, passport);
const poisRouter = require('./routes/pois')(app, express, passport);
const goibiboRouter = require('./routes/goibibo')(app, express, passport);
const latlongRouter = require('./routes/latlong')(app, express, passport);
const iataRouter = require('./routes/iata')(app, express, passport);

// point routes to routers
app.use('/', indexRouter);
app.use('/events', eventsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/zomato', zomatoRouter);
app.use('/pois', poisRouter);
app.use('/goibibo', goibiboRouter);
app.use('/latlong', latlongRouter);
app.use('/iata', iataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.render('404');
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
