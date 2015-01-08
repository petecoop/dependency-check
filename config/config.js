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
    db: 'mongodb://localhost/package-updates-development'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'package-updates'
    },
    port: 3000,
    db: 'mongodb://localhost/package-updates-test'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'package-updates'
    },
    port: 3000,
    db: 'mongodb://localhost/package-updates-production'
    
  }
};

module.exports = config[env];
