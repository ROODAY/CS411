module.exports = function(app, express, passport) {
	const router = express.Router();
	var axios = require('axios');
  	var mongodb = require('mongodb');
	
  // do google lat long then zomato geocode its better
	//search for city_id, input is a cityname, return zomato collections in that city
	router.post('/', function(req, res){
		mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
	      if(err) throw err;

	      let db = client.db(process.env.MONGODB);
	      let restaurants = db.collection('restsCache');

	      restaurants.findOne({lat: req.body.lat, long: req.body.lng}, function(err, docs){
	        if (err) throw err;

	        var inprogress = false;

	        if (docs) {
	          console.log("Found Cache Data for Restaurants");
	          res.send(docs);
	        } else {
	          inprogress = true;

	         	axios.get('https://developers.zomato.com/api/v2.1/geocode?lat=' + req.body.lng + '&lon=' + req.body.lng, {headers: { 'user-key': process.env.Z_USERKEY }} )
				.then(function (response) {
					restaurants.insertOne( {lat: req.body.lat, long: req.body.lng, nearby_restaurants: JSON.stringify(response.data.nearby_restaurants)}, {}, function(err, result){
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