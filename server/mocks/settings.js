module.exports = function(app) {
  var express = require('express');
  var moment = require('moment');

  var router = express.Router();

  router.get('/', function(req, res) {
    res.send({
      'settings': [{
        id: '1',
        view_link: 'http://example.com/q=%s',
        last_updated: moment().subtract(5, 'hours').toISOString()
      }]
    });
  });

  app.use('/api/settings', router);
};
