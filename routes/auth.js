module.exports = function(app, express, passport) {
  var router = express.Router();

  router.get('/login',
    passport.authenticate('facebook'));

  router.get('/login/return', 
    passport.authenticate('facebook', { failureRedirect: '/authFail' }),
    function(req, res) {
      res.redirect('/');
    });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  return router;
}