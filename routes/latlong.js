module.exports = function(app, express, passport) {
  const router = express.Router();
  const axios = require('axios');
  const mongodb = require('mongodb');
  
  /*
   * Google Maps Geocode API
   * Takes location
   * Checks cache for matching parameters, returns if it finds anything (no expiry as we don't expect this to change)
   * Else, call Google Maps Geocode with same parameters, cache result, and return to user
   */
  router.post('/', function(req, res){
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let latlong = db.collection('latlongCache');

      latlong.findOne({location: req.body.location}, function(err, docs){
        if (err) throw err;

        var inprogress = false;

        if (docs) {
          res.send(docs);
        } else {
          inprogress = true;

          axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.body.location + '&key=' + process.env.GOOGLE_KEY)
          .then(function (response) {
            latlong.insertOne( {location: req.body.location, geometry: JSON.stringify(response.data.results[0].geometry)}, {}, function(err, result){
              if (err) throw err;
                client.close(function (err) {
                  if(err) throw err;
                });
            });
            res.send(response.data.results[0])
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