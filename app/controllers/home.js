var express = require('express'),
  router = express.Router(),
  check = require('npm-check-latest'),
  config = require('../../config/config'),
  git = require('../lib/git'),
  github = require('../lib/github');

module.exports = function (app) {
  app.use('/', router);
};

var errors = {
  norepo: 'No repository entered',
  repofail: 'Failed to fetch repository',
  fileserr: 'Failed to read files',
  depserr: 'Failed to check dependencies',
  nodeps: 'No dependencies found',
  gherr: 'Error listing github repos'
};

function resError(res, err, json) {
  var message = errors[err];
  return json ? res.json({message: message}, 400) : res.redirect('/?msg=' + err);
}

router.get('/', function (req, res, next) {

  var message = '';
  if(req.param('msg')){
    message = errors[req.param('msg')];
  }

  if(req.isAuthenticated()){
    github.list(req.user.accessToken)
      .then(function (repos) {
        // res.json(repos);
        res.render('index', {
          title: 'Node Dependency Check',
          message: message,
          repos: repos
        });
      })
      .catch(function (e) {
        console.log(e);
        return resError(res, 'gherr', false);
      });
  }else{
    res.render('index', {
      title: 'Node Dependency Check',
      message: message
    });
  }


});

router.get('/check', function (req, res) {

  var url = req.param('git-repo');
  var dev = req.param('dev');
  var service_repo = req.param('repo');
  var format = req.param('format'); // allow format to be set e.g. format=json
  var isJson = format == 'json';
  
  if((!url && !service_repo) || (service_repo && !req.isAuthenticated())) return resError(res, 'norepo', isJson);

  var getDependencies;

  if(service_repo && req.isAuthenticated() && req.user.type == 'github'){
    getDependencies = github.getDependencies(service_repo, dev, req.user)
  }else{
    getDependencies = git.getDependencies(url, dev);
  }

  getDependencies
    .then(function (dependencies) {
      if(!Object.keys(dependencies).length){
        return resError(res, 'nodeps', isJson);
      }
      return dependencies;
    }).then(function (dependencies) {
      return check(dependencies)
        .then(function (updates) {
          isJson ? res.json(updates) : res.render('check', {
            packages: updates,
            repo: url || service_repo,
            dev: dev,
            user: req.user
          });
        });
    }).catch(function (e) {
      return resError(res, e || 'depserr', isJson);
    });

});

router.post('/issue', function (req, res) {

  var title = req.param('title');
  var body = req.param('body');
  var repo = req.param('repo');

  if(!title || !body || !repo || !req.isAuthenticated()) return res.render('issue', {message: 'Failed to create issue'});

  if(req.user.type == 'github'){
    github.createIssue(repo, title, body, req.user.accessToken)
      .then(function (issue) {
        res.render('issue', {
          issue: issue
        });
      }).catch(function (e) {
        res.render('issue', {message: 'Failed to create issue'});
      });
  }

});