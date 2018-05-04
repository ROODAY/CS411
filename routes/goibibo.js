module.exports = function(app, express, passport) {
  const router = express.Router();
  const axios = require('axios');
  const mongodb = require('mongodb');
  
  /*
   * Goibibo API
   * Takes srcIata, destIata, startDate, endDate
   * Checks cache for matching parameters within 3 days, returns if it finds anything
   * Else, call Goibibo with same parameters, cache result, and return to user
   */
  router.post('/flights', function(req, res){
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
      if(err) throw err;

      let db = client.db(process.env.MONGODB);
      let flights = db.collection('flightsCache');

      flights.findOne({srcIata: req.body.srcIata, destIata: req.body.destIata, startDate: req.body.startDate, endDate: req.body.endDate, createdAt : { $gte : new Date(new Date() - (1000 * 60 * 60 * 24 * 3)) }}, function(err, docs){
        if (err) throw err;

        var inprogress = false;

        if (docs) {
          res.send(docs.data);
        } else {
          inprogress = true;

          axios.get('https://developer.goibibo.com/api/search/?app_id=' + process.env.GOIBIBO_ID + '&app_key=' + process.env.GOIBIBO_KEY + '&source=' + req.body.srcIata + '&destination=' + req.body.destIata + '&dateofdeparture=' + req.body.startDate + '&dateofarrival=' + req.body.endDate + '&seatingclass=E&adults=1&children=0&infants=0&counter=100')
          .then(function (response) {
            flights.insertOne( {srcIata: req.body.srcIata, destIata: req.body.destIata, startDate: req.body.startDate, endDate: req.body.endDate, createdAt: new Date(), data: JSON.stringify(response.data)}, {}, function(err, result){
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