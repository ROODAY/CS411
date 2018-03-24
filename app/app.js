var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var queryRouter = require('./routes/query');
var usersRouter = require('./routes/users');

var app = express();

var fs = require('fs');
var axios = require('axios');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/query', queryRouter);
app.use('/users', usersRouter);

app.post('/query', function (req, res) {
  fs.readFile('app.token', 'utf8', function(err, contents) {
      var token = contents;
      axios.get('https://www.eventbriteapi.com/v3/events/search/?q=' + req.body.query +'&token=' + token)
      .then(function (response) {
        res.send(response.data);
      })
      .catch(function (error) {
        console.log(error);
        res.send(error);
      });
  });
})

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
