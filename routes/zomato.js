module.exports = function(app, express, passport) {
	const router = express.Router();
	var zomato = require('zomato');
	var client = zomato.createClient({
	userKey: Z_USERKEY
	});

	router.get('/', function(req, res){
		var city = req.params.cityid;
		client.getCollections({
		city_id:"1", //id of the city for which collections are needed 
		lat:"28.613939", //latitude 
		lon:"77.209021", //longitude 
		count:"5" // number of maximum result to display 
		}, function(err, result){
			if(!err){
			  res.send(result);
			}else {
			  res.send(err);
			}
		});
	})
	
	router.get('/:id', function(req, res){
		var id = req.params.id;
		client.getCollections({
		city_id: id, //id of the city for which collections are needed 
		count:"5" // number of maximum result to display 
		}, function(err, result){
			if(!err){
			  res.send(result);
			}else {
			  res.send(err);
			}
		});
	})
	
	router.get('/:city', function(req, res){
		var city = req.params.city;
		client.getCities({
		q: 'Boston'
		}, function(err, result){
			if(!err){
			  res.send(result);
			}else {
			  res.send(err);
			}
		});
	})

  return router;
}