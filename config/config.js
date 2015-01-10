var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'package-updates'
    },
    port: 3000,
    repo_path: rootPath + '/repos'
  },

  production: {
    root: rootPath,
    app: {
      name: 'package-updates'
    },
    port: process.env.PORT,
    repo_path: rootPath + '/repos'
  }
};

module.exports = config[env];
