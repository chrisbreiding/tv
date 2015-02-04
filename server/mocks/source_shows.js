module.exports = function(app) {
  var express = require('express');
  var moment = require('moment');
  var _ = require('lodash');
  var bacon = require('baconipsum');
  var sourceShowsRouter = express.Router();

  var shows = _.map(_.range(10, 20), function (id) {
    return {
      id: '' + id,
      name: bacon(_.random(1, 4)),
      description: bacon(_.random(10, 30)),
      firstAired: moment()
                    .subtract(_.random(1, 10), 'years')
                    .subtract(_.random(1, 20), 'days'),
      network: bacon(1).substr(0, 3).toUpperCase()
    };
  });

  sourceShowsRouter.get('/', function(req, res) {
    res.send({
      'source_shows': _.sample(shows, _.random(2, 10))
    });
  });

  app.use('/source_shows', sourceShowsRouter);
};
