module.exports = function(app, express, passport) {
  const router = express.Router();
  const axios = require('axios');
  const mongodb = require('mongodb');
  
  /*
   * IATA Geo API
   * Takes lat, lng
   * Checks cache for matching parameters, returns if it finds anything (no expiry as we don't expect this to change)
   * Else, call IATA Geo with same parameters, cache result, and return to user
   */
  router.post('/', function(req, res){
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let iatas = db.collection('iataCache');

      iatas.findOne({lat: req.body.lat, lng: req.body.lng}, function(err, docs){
        if (err) throw err;

        var inprogress = false;

        if (docs) {
          res.send(docs.IATA);
        } else {
          inprogress = true;

          axios.get('https://iatageo.com/getCode/' + req.body.lat + '/' + req.body.lng)
          .then(function (response) {
            iatas.insertOne( {lat: req.body.lat, lng: req.body.lng, IATA: JSON.stringify(response.data.IATA)}, {}, function(err, result){
              if (err) throw err;
                client.close(function (err) {
                  if(err) throw err;
                });
              });
            res.send(response.data.IATA)
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