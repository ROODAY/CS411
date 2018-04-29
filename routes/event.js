module.exports = function(app, express, passport) {
	const router = express.Router();
	var Eventbrite = require('node-eventbrite');
	var client = Eventbrite({
      token: EB_TOKEN,
      version : 'v3'
    });

/* 	router.get('/:id', function(req, res){
		var id = req.params.id;
		client.event_details({'event_id': id }, function(err, data){
			if(!err){
			  res.send(data);
			}else {
			  res.send(err);
			}
		});
	})
 */
	router.get('/:eventname', function(req, res){
		var eventname = req.params.eventname;
		client.search({q: eventname}, function(err, data){
			if(!err){
			  res.send(data);
			}else {
			  res.send(err);
			}
		});
	})
	
	router.get('/categories', function(req, res){
		var eventname = req.params.eventname;
		client.categories(function(err, data){
			if(!err){
			  res.send(data);
			}else {
			  res.send(err);
			}
		});
	})
	return router;
}

