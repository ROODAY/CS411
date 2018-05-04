module.exports = function(app, express, passport) {
  const router = express.Router();

  /*
   * Login user through Facebook OAuth
   */
  router.get('/login',
    passport.authenticate('facebook'));

  /*
   * On OAuth callback, if user is authenticated, take them home
   * Else, let them know auth failed
   */
  router.get('/login/return', 
    passport.authenticate('facebook', { failureRedirect: '/authFail' }),
    function(req, res) {
      res.redirect('/');
    });

  /*
   * Logout user from Passport and redirect home
   */
  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  return router;
}