module.exports = function(app, express, passport) {
	var router =  express.Router();
	var axios = require('axios');
  	var mongodb = require('mongodb');
	
	//Geocode city name, search Google Places API with location coordinates
	router.post('/', function(req, res) {
		mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
	      if(err) throw err;

	      let db = client.db(process.env.MONGODB);
	      let pois = db.collection('poisCache');

	      pois.findOne({lat: req.body.lat, long: req.body.lng}, function(err, docs){
	        if (err) throw err;

	        var inprogress = false;

	        if (docs) {
	          console.log("Found Cache Data for POIs");
	          res.send(docs);
	        } else {
	          inprogress = true;

	          	axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=10000&location=' + req.body.lat + ',' + req.body.lng + '&key=' + process.env.GOOGLE_KEY)
				.then(function (response) {
					pois.insertOne( {lat: req.body.lat, long: req.body.lng, results: JSON.stringify(response.data.results)}, {}, function(err, result){
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
