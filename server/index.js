module.exports = function(app) {
  var globSync   = require('glob').sync;
  var mocks      = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  var proxies    = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require);
  var bodyParser = require('body-parser');

  // Log proxy requests
  var morgan = require('morgan');
  app.use(morgan('dev'));
  app.use(bodyParser.json());

  var API_KEY = 'apikey';
  var express = require('express');
  var router = express.Router();

  router.use(function (req, res, next) {
    if (req.headers.api_key !== API_KEY) {
      return res.status(401).end();
    }

    next();
  });
  app.use('/api', router);

  mocks.forEach(function(route) { route(app); });
  proxies.forEach(function(route) { route(app); });
};
