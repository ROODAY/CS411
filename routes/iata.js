module.exports = function(app, express, passport) {
  const router = express.Router();
  var axios = require('axios');
  var mongodb = require('mongodb');
  
  router.post('/', function(req, res){
      mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
        if(err) throw err;

        let db = client.db(process.env.MONGODB);
        let iatas = db.collection('iataCache');

        iatas.findOne({lat: req.body.lat, long: req.body.lng}, function(err, docs){
          if (err) throw err;

          var inprogress = false;

          if (docs) {
            console.log("Found Cache Data for IATA");
            res.send(docs.IATA);
          } else {
            inprogress = true;

            axios.get('https://iatageo.com/getCode/' + req.body.lat + '/' + req.body.lng)
            .then(function (response) {
              iatas.insertOne( {lat: req.body.lat, long: req.body.lng, IATA: JSON.stringify(response.data.IATA)}, {}, function(err, result){
                  if (err) throw err;

                  client.close(function (err) {
                    if(err) throw err;
                  });
              });
              res.send(response.data.IATA)
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