module.exports = function(app, express, passport) {
  const router = express.Router();
  var axios = require('axios');
  var mongodb = require('mongodb');
  
  router.post('/', function(req, res){
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let latlong = db.collection('latlongCache');

      latlong.findOne({location: req.body.location}, function(err, docs){
        if (err) throw err;

        var inprogress = false;

        if (docs) {
          console.log("Found Cache Data for Lat/Long");
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
            console.log(response.data.results[0])
            res.send(response.data.results[0])
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