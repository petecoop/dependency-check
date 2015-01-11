var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'package-updates',
      host: 'http://localhost:3000'
    },
    port: 3000,
    session_secret: 'somesecret',
    repo_path: rootPath + '/repos',
    github: {
      client_id: process.env.GITHUB_CLIENT_ID || '123',
      client_secret: process.env.GITHUB_CLIENT_SECRET || '123'
    }
  },

  production: {
    root: rootPath,
    app: {
      name: 'package-updates',
      host: 'http://ndc.petecoop.co.uk'
    },
    port: process.env.PORT,
    session_secret: process.env.SESSION_SECRET,
    repo_path: rootPath + '/repos',
    github: {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET
    }
  }
};

module.exports = config[env];
