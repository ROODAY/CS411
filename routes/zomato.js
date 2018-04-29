module.exports = function(app, express, passport) {
	const router = express.Router();
	var axios = require('axios');
	
	//search for city_id, input is a cityname, return zomato collections in that city
	router.post('/', function(req, res){
		axios.get('https://developers.zomato.com/api/v2.1/locations?query=' + req.body.query, {headers: { 'user-key': '34ffc8f7c3a06bd652a07922726d8ed0' }} )
		.then(function (response) {
			var cityid = JSON.stringify(response.data.location_suggestions[0].city_id);
		  	axios.get('https://developers.zomato.com/api/v2.1/collections?city_id=' + cityid, {headers: { 'user-key': '34ffc8f7c3a06bd652a07922726d8ed0' }} )
			.then(function (response) {
			  res.send(response.data);
			})
			.catch(function (error) {
			  console.log(error);
			  res.send(error);
			})
		})
		.catch(function (error) {
		  console.log(error);
		  res.send(error);
		});
	})
	
  return router;
}