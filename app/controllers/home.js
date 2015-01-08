var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  check = require('npm-check-latest');

module.exports = function (app) {
  app.use('/', router);
};


router.get('/', function (req, res, next) {

  var dependencies = {
    express: '~4.10.6'
  };

  check(dependencies)
    .then(function (updates) {
      res.json(updates);
    })
    .catch(function (e) {
      res.json(e);
    });

});

router.get('/check', function (req, res) {

  // checkout file using git archive

  // test for version

  // display results

});