module.exports = function(app, express, passport) {
  const router = express.Router();
  const mongodb = require('mongodb');

  /*
   * Returns all users and their data
   */
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

  /*
   * Returns user data for requested user ID
   */
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

  /*
   * Creates new user
   * If user already exists, updates user with new object
   */
  router.post('/', function(req, res, next) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let users = db.collection('users');


      if (!req.body.userData.savedTrips) {
        req.body.userData.savedTrips = [];
      }

      users.replaceOne({id: req.body.userData.id}, req.body.userData, {upsert: true}, function(err, docs){
        if (err) throw err;

        users.findOne({id: req.body.userData.id}, function(err, docs){
          if (err) throw err;

          res.send(docs);

          client.close(function (err) {
            if(err) throw err;
          });
        });
      });
    });
  });

  /*
   * Deletes user completely
   */
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

  return router;
}