var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    res.render('index', { title: 'Travel App Prototype', user: user});
  } else {
    res.render('index', { title: 'Travel App Prototype' });
  }
});

module.exports = router;
