module.exports = function(app, express, passport) {
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    if (req.user) {
      res.render('index', { title: 'Trippppr', user: req.user, userData: JSON.stringify(req.user)});
    } else {
      res.render('index', { title: 'Trippppr | Login' });
    }
  });

  router.get('/authFail', function(req, res, next) {
    res.render('authFail');
  });

  return router;
}