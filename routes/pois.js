module.exports = function(app, express, passport) {
  const router =  express.Router();
  const axios = require('axios');
  const mongodb = require('mongodb');
  
  /*
   * Google Maps Places API
   * Takes lat, lng
   * Checks cache for matching parameters within 3 days, returns if it finds anything
   * Else, call Google Maps Places with same parameters, cache result, and return to user
   */
  router.post('/', function(req, res) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let pois = db.collection('poisCache');

      pois.findOne({lat: req.body.lat, lng: req.body.lng, createdAt : { $gte : new Date(new Date() - (1000 * 60 * 60 * 24 * 3)) }}, function(err, docs){
        if (err) throw err;

        var inprogress = false;

        if (docs) {
          res.send(docs);
        } else {
          inprogress = true;

          axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=10000&location=' + req.body.lat + ',' + req.body.lng + '&key=' + process.env.GOOGLE_KEY)
          .then(function (response) {
            pois.insertOne( {lat: req.body.lat, lng: req.body.lng, createdAt: new Date(), results: JSON.stringify(response.data.results)}, {}, function(err, result){
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