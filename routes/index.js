module.exports = function(app, express, passport) {
  const router = express.Router();

  /*
   * Home Page
   * If user is in session, pass user to view
   */
  router.get('/', function(req, res, next) {
    if (req.user) {
      res.render('index', { title: 'Trippppr', user: req.user, userData: JSON.stringify(req.user)});
    } else {
      res.render('index', { title: 'Trippppr | Login' });
    }
  });

  /*
   * About Page
   * If user is in session, pass user to view
   */
  router.get('/about', function(req, res, next) {
    if (req.user) {
      res.render('about', { title: 'About', user: req.user, userData: JSON.stringify(req.user)});
    } else {
      res.render('about', { title: 'About | Login' });
    }
  });

  /*
   * Saved Trips Page
   * Show only if user is in session, and pass user to view
   * If no user, redirect to home
   */
  router.get('/trips', function(req, res, next) {
    if (req.user) {
      res.render('trips', { title: 'Saved Trips', user: req.user, userData: JSON.stringify(req.user)});
    } else {
      res.redirect('/');
    }
  });

  /*
   * Authentication Failure
   * Informs user of authentication failure
   */
  router.get('/authFail', function(req, res, next) {
    res.render('authFail');
  });

  return router;
}