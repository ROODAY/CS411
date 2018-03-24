var express = require('express');
var router = express.Router();
var fs = require('fs');
var axios = require('axios');

/* POST query. */
router.post('/query', function (req, res) {
  console.log(req)
  fs.readFile('../app.token', 'utf8', function(err, contents) {
      var token = contents;
      axios.get('https://www.eventbriteapi.com/v3/events/search/?q=' +  +'token=' + token)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
  res.send('POST request to the homepage');
})

module.exports = router;
