var express = require('express'),
  router = express.Router(),
  check = require('npm-check-latest'),
  git = require('gift'),
  md5 = require('md5'),
  fs = require('fs'),
  path = require('path'),
  rm = require('rimraf'),
  config = require('../../config/config');

module.exports = function (app) {
  app.use('/', router);
};

var errors = {
  norepo: 'No repository entered',
  repofail: 'Failed to fetch repository',
  fileserr: 'Failed to read files',
  depserr: 'Failed to check dependencies',
  nodeps: 'No dependencies found'
};

router.get('/', function (req, res, next) {

  res.render('index', {
    title: 'Node Dependency Check'
  });

});

function resError(res, err, json) {
  var message = errors[err];
  return json ? res.json({message: message}, 400) : res.redirect('/?msg=' + err);
}

router.get('/check', function (req, res) {

  var url = req.param('git-repo');
  var dev = req.param('dev');
  var format = req.param('format'); // allow format to be set e.g. format=json
  var isJson = format == 'json';
  
  if(!url) return resError(res, 'norepo', isJson);

  // clone git repo
  var repo_path = config.repo_path + '/' + md5.digest_s(url);
  git.clone(url, repo_path, function (err, repo) {
    if(err) return resError(res, 'repofail', isJson);
    
    fs.readdir(repo.path, function (err, files) {
      if(err) return resError(res, 'fileserr', isJson);

      // get dependencies
      var dependencies = {};
      if(files.indexOf('package.json') !== -1){
        var pkg = require(repo_path + '/package.json');
        if(pkg.dependencies){
          dependencies = pkg.dependencies;
        }
        if(dev && pkg.devDependencies){
          for(var d in pkg.devDependencies){
            dependencies[d] = pkg.devDependencies[d];
          }
        }
      }
      if(files.indexOf('.dependencies.json') !== -1){
        var dotDependencies = require(repo_path + '/.dependencies.json');
        for(var d in dotDependencies){
          dependencies[d] = dotDependencies[d];
        }
      }

      if(!Object.keys(dependencies).length){
        return resError(res, 'nodeps', isJson);
      }

      check(dependencies)
        .then(function (updates) {
          isJson ? res.json(updates) : res.render('check', {
            packages: updates,
            repo: url,
            dev: dev
          });
        })
        .catch(function (e) {
          console.log('check deps error', e);
          return resError(res, 'depserr', isJson);
        });

      // once done delete the repo
      rm(repo_path, function (err) {
        if(err) console.log(err);
      });
    });

  });

});