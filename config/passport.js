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
    userAgent: config.app.name,
    scope: ['repo']
  }, function (accessToken, refreshToken, profile, done) {

    return done(null, {
      type: 'github',
      accessToken: accessToken,
      refreshToken: refreshToken,
      profile: profile
    });

  }));

};