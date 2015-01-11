var config = require('./config');
var GitHubStrategy = require('passport-github').Strategy;

module.exports = function (passport) {

  passport.serializeUser(function (user, done){
    done(null, user);
  });

  passport.deserializeUser(function (user, done){
    done(null, user);
  });

  passport.use(new GitHubStrategy({
    clientID: config.github.client_id,
    clientSecret: config.github.client_secret,
    callbackURL: config.app.host + '/auth/github/callback'  
  }),
  function (accessToken, refreshToken, profile, done) {

    // To keep the example simple, the user's GitHub profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the GitHub account with a user record in your database,
    // and return that user instead.
    return done(null, profile);

  });

};