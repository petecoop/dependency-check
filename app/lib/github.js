var request = require('request-promise'),
  Promise = require('bluebird');

var endpoint = 'https://api.github.com';

exports.list = function (token) {

  return request({
    url: endpoint + '/user/repos',
    qs: {
      access_token: token
    },
    headers: {
      'User-Agent': 'Node Dependency Check'
    },
    json: true
  });

};

exports.content = function (repo, file, token) {

  return request({
    url: endpoint + '/repos/' + repo + '/contents/' + file,
    qs: {
      access_token: token
    },
    headers: {
      'User-Agent': 'Node Dependency Check'
    },
    json: true
  }).then(function (data) {
    var content = new Buffer(data.content, 'base64').toString('ascii');
    return JSON.parse(content);
  });

};

exports.createIssue = function (repo, title, body, token) {

  return request({
    url: endpoint + '/repos/' + repo + '/issues',
    qs: {
      access_token: token
    },
    headers: {
      'User-Agent': 'Node Dependency Check'
    },
    method: 'POST',
    json: true,
    body: {
      title: title,
      body: body
    }
  });

};

exports.getDependencies = function (repo, dev, user) {

  return Promise.settle([
    this.content(repo, 'package.json', user.accessToken)
      .then(function (pkg) {
        var dependencies = {};
        if(pkg.dependencies){
          dependencies = pkg.dependencies;
        }
        if(dev && pkg.devDependencies){
          for(var d in pkg.devDependencies){
            dependencies[d] = pkg.devDependencies[d];
          }
        }
        return dependencies;
      }),
    this.content(repo, '.dependencies.json', user.accessToken)
  ]).then(function (results) {
    var dependencies = {};
    results.forEach(function (r) {
      if(r.isFulfilled()){
        var values = r.value();
        for(var v in values){
          dependencies[v] = values[v];
        }
      }
    });
    return dependencies;
  });

};