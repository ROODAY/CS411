var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('mongodb');

var indexRouter = require('./routes/index');
var queryRouter = require('./routes/query');
var usersRouter = require('./routes/users');

var app = express();

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

let seedData = [
  {
    decade: '1970s',
    artist: 'Debby Boone',
    song: 'You Light Up My Life',
    weeksAtOne: 10
  },
  {
    decade: '1980s',
    artist: 'Olivia Newton-John',
    song: 'Physical',
    weeksAtOne: 10
  },
  {
    decade: '1990s',
    artist: 'Mariah Carey',
    song: 'One Sweet Day',
    weeksAtOne: 16
  }
];

mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {

  if(err) throw err;

  let db = client.db('dbname')
  let songs = db.collection('songs');
  songs.insert(seedData, function(err, result) {

    if(err) throw err;

    /*
     * Then we need to give Boyz II Men credit for their contribution
     * to the hit "One Sweet Day".
     */

    songs.update(
      { song: 'One Sweet Day' },
      { $set: { artist: 'Mariah Carey ft. Boyz II Men' } },
      function (err, result) {

        if(err) throw err;

        /*
         * Finally we run a query which returns all the hits that spend 10 or
         * more weeks at number 1.
         */

        songs.find({ weeksAtOne : { $gte: 10 } }).sort({ decade: 1 }).toArray(function (err, docs) {

          if(err) throw err;

          docs.forEach(function (doc) {
            console.log(
              'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] +
              ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
            );
          });
        });
      }
    );
    
  });
});

module.exports = app;
