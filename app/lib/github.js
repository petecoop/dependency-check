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

exports.getDependencies = function (repo, dev, user) {

  return Promise.all([
    this.content(repo, 'package.json', user.accessToken),
    this.content(repo, '.dependencies.json', user.accessToken)
  ]).finally(function (data) {
    console.log(data);
  });

};