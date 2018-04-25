var express = require('express');
var router = express.Router();
var axios = require('axios');

/* POST query. */
router.post('/', function (req, res) {
  console.log(req)
  axios.get('https://www.eventbriteapi.com/v3/events/search/?q=' +  +'token=' + process.env.EVENTBRITE_TOKEN)
  .then(function (response) {
    res.send(response.data);
  })
  .catch(function (error) {
    console.log(error);
    res.send(error);
  });
})

module.exports = router;
