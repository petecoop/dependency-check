var config = require('../../config/config'),
  md5 = require('md5'),
  git = require('gift'),
  fs = require('fs'),
  rm = require('rimraf'),
  Promise = require('bluebird');

// return Promise with dependencies
exports.getDependencies = function (url, dev) {

  return new Promise(function (fulfill, reject) {
    var repo_path = config.repo_path + '/' + md5.digest_s(url);
      git.clone(url, repo_path, function (err, repo) {
        console.log(err);
        if(err) return reject('repofail');
        
        fs.readdir(repo.path, function (err, files) {
          if(err) return reject('fileserr');

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

          // once done delete the repo
          rm(repo_path, function (err) {
            if(err) console.log(err);
          });

          return fulfill(dependencies);
        });

      });
  });
  
};

