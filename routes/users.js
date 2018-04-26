module.exports = function(app, express, passport) {
  var router = express.Router();

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.get('/:userId', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.get('/:userId/travelPreferences', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.get('/:userId/trips', function(req, res, next) {
    res.send('respond with a resource');
  });

  return router;
}