module.exports = function(app, express, passport) {
	var router =  express.Router();
	var axios = require('axios');
	
	//Geocode city name, search Google Places API with location coordinates
	router.post('/', function(req, res) {
		axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.body.query + '&key=' + process.env.GOOGLE_KEY)
		.then(function (response) {
			var latitude = JSON.stringify(response.data.results[0].geometry.location.lat);
			var longitude = JSON.stringify(response.data.results[0].geometry.location.lng);
			
			axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&key=' + process.env.GOOGLE_KEY)
			.then(function (response) {
				res.send(response.data);
			})
			.catch(function (error) {
				console.log(error);
				res.send(error);
			});
		})
		.catch(function (error) {
			console.log(error);
			res.send(error);
		});
	});
	return router;
}
