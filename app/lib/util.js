var Promise = require('bluebird');

exports.jsonDependencies = function (json, dev) {
  return new Promise(function (resolve, reject) {
    var dependencies = {};
    var pkg = JSON.parse(json);
    if (pkg.dependencies) {
      dependencies = pkg.dependencies;
    }
    if(dev && pkg.devDependencies){
      for(var d in pkg.devDependencies){
        dependencies[d] = pkg.devDependencies[d];
      }
    }
    resolve(dependencies);
  });
};