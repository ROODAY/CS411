module.exports = function(app, express, passport) {
  const router = express.Router();
  const axios = require('axios');
  const mongodb = require('mongodb');

  /*
   * Eventbrite API
   * Takes lat, lng, startDate, endDate
   * Checks cache for matching parameters within 3 days, returns if it finds anything
   * Else, call Eventbrite with same parameters, cache result, and return to user
   */
  router.post('/', function (req, res) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let events = db.collection('eventsCache');

      events.findOne({lat: req.body.lat, lng: req.body.lng, startDate: req.body.startDate, endDate: req.body.endDate, createdAt : { $gte : new Date(new Date() - (1000 * 60 * 60 * 24 * 3)) }}, function(err, docs){
        if (err) throw err;

        var inprogress = false;

        if (docs) {
          res.send(docs);
        } else {
          inprogress = true;

          axios.get('https://www.eventbriteapi.com/v3/events/search/?location.within=100km&location.latitude=' + req.body.lat + '&location.longitude=' + req.body.lng + '&start_date.range_start=' + req.body.startDate + '&start_date.range_end=' + req.body.endDate + '&token=' + process.env.EVENTBRITE_TOKEN)
          .then(function (response) {
            events.insertOne( {location: req.body.location, startDate: req.body.startDate, endDate: req.body.endDate, createdAt: new Date(), events: JSON.stringify(response.data.events)}, {}, function(err, result){
              if (err) throw err;

              client.close(function (err) {
                if(err) throw err;
              });
            });
            res.send(response.data);
          })
          .catch(function (error) {
            console.error(error);
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