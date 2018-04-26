module.exports = function(app, express, passport) {
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    if (req.user) {
      console.log(req.user)
      res.render('index', { title: 'Travel App Prototype', user: req.user, userData: JSON.stringify(req.user)});
    } else {
      console.log("sad boy")
      res.render('index', { title: 'Travel App Prototype' });
    }
  });

  router.get('/authFail', function(req, res, next) {
    res.render('authFail');
  });

  return router;
}