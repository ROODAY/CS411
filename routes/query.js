var express = require('express');
var router = express.Router();
var axios = require('axios');
var mongodb = require('mongodb');

/* POST query. */
router.post('/', function (req, res) {
  axios.get('https://www.eventbriteapi.com/v3/events/search/?q=' + req.body.query +'&token=' + process.env.EVENTBRITE_TOKEN)
  .then(function (response) {
    res.send(response.data);
  })
  .catch(function (error) {
    console.log(error);
    res.send(error);
  });
})

router.get('/', function(req, res) {
  mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
    if(err) throw err;

    let db = client.db(process.env.MONGODB);
    let songs = db.collection('songs');

    songs.find({ weeksAtOne : { $gte: 10 } }).sort({ decade: 1 }).toArray(function (err, docs) {
      if(err) throw err;

      res.send(docs);

      client.close(function (err) {
        if(err) throw err;
      });
    });
  });
});

module.exports = router;
