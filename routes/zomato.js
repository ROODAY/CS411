module.exports = function(app, express, passport) {
  const router = express.Router();
  const axios = require('axios');
  const mongodb = require('mongodb');
  
  /*
   * Zomato API
   * Takes lat, lng
   * Checks cache for matching parameters within 3 days, returns if it finds anything
   * Else, call Zomato with same parameters, cache result, and return to user
   */
  router.post('/', function(req, res){
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let restaurants = db.collection('restsCache');

      restaurants.findOne({lat: req.body.lat, lng: req.body.lng, createdAt : { $gte : new Date(new Date() - (1000 * 60 * 60 * 24 * 3)) }}, function(err, docs){
        if (err) throw err;

        var inprogress = false;

        if (docs) {
          res.send(docs);
        } else {
          inprogress = true;

          axios.get('https://developers.zomato.com/api/v2.1/geocode?lat=' + req.body.lat + '&lon=' + req.body.lng, {headers: { 'user-key': process.env.Z_USERKEY }} )
          .then(function (response) {
            restaurants.insertOne( {lat: req.body.lat, lng: req.body.lng, createdAt: new Date(), nearby_restaurants: JSON.stringify(response.data.nearby_restaurants)}, {}, function(err, result){
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