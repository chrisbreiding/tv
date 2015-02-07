module.exports = function(app) {
  var express = require('express');
  var moment = require('moment');
  var _ = require('lodash');

  var router = express.Router();

  var settings = {
    id: '1',
    view_link: 'http://example.com/q=%s',
    last_updated: moment().subtract(5, 'hours').toISOString()
  };

  router.get('/', function(req, res) {
    res.send({
      'settings': [settings]
    });
  });

  router.put('/:id', function(req, res) {
    res.send({
      'settings': _.extend(settings, req.body.settings)
    })
  });

  app.use('/api/settings', router);
};
