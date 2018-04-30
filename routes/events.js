module.exports = function(app, express, passport) {
  var router = express.Router();
  var axios = require('axios');
  var mongodb = require('mongodb');

  /* POST query. */
  /*search by keyword*/
  router.post('/', function (req, res) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let events = db.collection('eventsCache');

      events.findOne({location: req.body.location, startDate: req.body.startDate, endDate: req.body.endDate}, function(err, docs){
        if (err) throw err;

        var inprogress = false;

        if (docs) {
          console.log("found data");
          res.send(docs);
        } else {
          inprogress = true;

          axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.body.location + '&key=' + process.env.GOOGLE_KEY)
          .then(function (response) {
            var latitude = JSON.stringify(response.data.results[0].geometry.location.lat);
            var longitude = JSON.stringify(response.data.results[0].geometry.location.lng);

            axios.get('https://www.eventbriteapi.com/v3/events/search/?location.within=100km&location.latitude=' + latitude + '&location.longitude=' + longitude + '&start_date.range_start=' + req.body.startDate + '&start_date.range_end=' + req.body.endDate + '&token=' + process.env.EVENTBRITE_TOKEN)
            .then(function (response) {
              events.insertOne( {location: req.body.location, startDate: req.body.startDate, endDate: req.body.endDate, events: JSON.stringify(response.data.events)}, {}, function(err, result){
                if (err) throw err;

                client.close(function (err) {
                  if(err) throw err;
                });
              });
              res.send(response.data);
            })
            .catch(function (error) {
              console.log(error);
              res.send(error);
            });
          })
          .catch(function (error) {
            console.log(error);
            res.send(error);
          });

            
        }

        if (!inprogress) {
          client.close(function (err) {
            if(err) throw err;
          });
        }
      });
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

  return router;
}