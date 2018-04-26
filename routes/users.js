module.exports = function(app, express, passport) {
  var router = express.Router();
  var mongodb = require('mongodb');

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let users = db.collection('users');

      users.find({}).toArray(function(err, docs){
        if (err) throw err;

        res.send(docs);

        client.close(function (err) {
          if(err) throw err;
        });
      });
    });
  });

  router.get('/:userId', function(req, res, next) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let users = db.collection('users');

      users.findOne({id: req.params.userId}, function(err, docs){
        if (err) throw err;

        res.send(docs);

        client.close(function (err) {
          if(err) throw err;
        });
      });
    });
  });

  router.post('/', function(req, res, next) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let users = db.collection('users');

      users.replaceOne({id: req.body.userData.id}, req.body.userData, {upsert: true}, function(err, docs){
        if (err) throw err;

        res.send(docs);

        client.close(function (err) {
          if(err) throw err;
        });
      });
    });
  });

  router.delete('/:userId', function(req, res, next) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let users = db.collection('users');

      users.deleteOne({id: req.params.userId}, function(err, docs){
        if (err) throw err;

        res.send(docs);

        client.close(function (err) {
          if(err) throw err;
        });
      });
    });
  });

  router.get('/:userId/travelPreferences', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.get('/:userId/trips', function(req, res, next) {
    res.send('respond with a resource');
  });

  return router;
}