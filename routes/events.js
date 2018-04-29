module.exports = function(app, express, passport) {
  var router = express.Router();
  var axios = require('axios');
  var mongodb = require('mongodb');

  /* POST query. */
  /*search by keyword*/
  router.post('/', function (req, res) {
    axios.get('https://www.eventbriteapi.com/v3/events/search/?q=' + req.body.query +'&token=' + process.env.EVENTBRITE_TOKEN)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.send(error);
    });
  });
  
  /*search by date (date format: 2010-01-31T13:00:00)*/
   router.post('/date', function (req, res) {
    axios.get('https://www.eventbriteapi.com/v3/events/search/?start_date.range_start=' + req.body.query +'&token=' + process.env.EVENTBRITE_TOKEN)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.send(error);
    });
  });
  
  /*search by location*/
  router.post('/location', function (req, res) {
    axios.get('https://www.eventbriteapi.com/v3/events/search/?location.address=' + req.body.query +'&token=' + process.env.EVENTBRITE_TOKEN)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.send(error);
    });
  });

   router.get('/', function(req, res) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let songs = db.collection('songs');

      songs.find({ weeksAtOne : { $gte: 10 } }).sort({ decade: 1 }).toArray(function (err, docs) {
        if(err) throw err;

        res.send(docs);

        client.close(function (err) {
          if(err) throw err;
        });
      });
    });
  });

  return router;
}