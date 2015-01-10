var express = require('express'),
  config = require('./config/config'),
  glob = require('glob')

var app = express();

require('./config/express')(app, config);

app.listen(config.port);

