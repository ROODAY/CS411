module.exports = function(app, express, passport) {
  const router = express.Router();
  var axios = require('axios');
  
  router.post('/flights', function(req, res){
    axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.body.source + '&key=' + process.env.GOOGLE_KEY)
    .then(function (response) {
      var latitude = JSON.stringify(response.data.results[0].geometry.location.lat);
      var longitude = JSON.stringify(response.data.results[0].geometry.location.lng);
      axios.get('https://iatageo.com/getCode/' + latitude + '/' + longitude)
      .then(function (response) {
        var sourceIATA = response.data.IATA;

        axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.body.dest + '&key=' + process.env.GOOGLE_KEY)
        .then(function (response) {
          var latitude = JSON.stringify(response.data.results[0].geometry.location.lat);
          var longitude = JSON.stringify(response.data.results[0].geometry.location.lng);
          axios.get('https://iatageo.com/getCode/' + latitude + '/' + longitude)
          .then(function (response) {
            var destIATA = response.data.IATA;
            
            axios.get('https://developer.goibibo.com/api/search/?app_id=' + process.env.GOIBIBO_ID + '&app_key=' + process.env.GOIBIBO_KEY + '&source=' + sourceIATA + '&destination=' + destIATA + '&dateofdeparture=' + req.body.startDate + '&dateofarrival=' + req.body.endDate + '&seatingclass=E&adults=1&children=0&infants=0&counter=100')
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
    })
    .catch(function (error) {
      console.log(error);
      res.send(error);
    });
  });
  
  return router;
}