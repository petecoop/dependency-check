var request = require('request-promise');

var endpoint = 'https://hostname/api/v3/';

exports.list = function (token) {

  return request({
    url: endpoint + '/user/repos',
    qs: {
      access_token: token
    }
  });

};