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

      events.findOne({lat: req.body.lat, lng: req.body.lng, startDate: req.body.startDate, endDate: req.body.endDate}, function(err, docs){
        if (err) throw err;

        var inprogress = false;

        if (docs) {
          console.log("Found Cache Data for Events");
          res.send(docs);
        } else {
          inprogress = true;

          axios.get('https://www.eventbriteapi.com/v3/events/search/?location.within=100km&location.latitude=' + req.body.lat + '&location.longitude=' + req.body.lng + '&start_date.range_start=' + req.body.startDate + '&start_date.range_end=' + req.body.endDate + '&token=' + process.env.EVENTBRITE_TOKEN)
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
        }

        if (!inprogress) {
          client.close(function (err) {
            if(err) throw err;
          });
        }
      });
    });      
  });

  return router;
}