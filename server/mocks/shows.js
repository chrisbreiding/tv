module.exports = function(app) {
  var express = require('express');
  var moment = require('moment');
  var _ = require('lodash');
  var bodyParser = require('body-parser');

  var generator = require('../shows-generator');

  var showsRouter = express.Router();

  var episodes = [];
  var shows = _.map(_.range(8), function () {
    var generation = generator.show(generator.incShowId());
    episodes = episodes.concat(generation.episodes);
    return generation.show;
  });

  showsRouter.get('/', function(req, res) {
    res.send({
      'shows': shows,
      'episodes': episodes
    });
  });

  showsRouter.post('/', function(req, res) {
    var show = _.extend(req.body.show, { id: '' + generator.incShowId() });
    var newEpisodes = generator.seasons(_.random(1, 8));
    show.episodes = _.pluck(newEpisodes, 'id');
    shows.push(show);
    episodes = episodes.concat(newEpisodes);
    res
      .status(201)
      .send({
        'show': show,
        'episodes': newEpisodes
      });
  });

  showsRouter.get('/:id', function(req, res) {
    res.send({
      'show': _.where(shows, { id: req.params.id })
    });
  });

  showsRouter.put('/:id', function(req, res) {
    var show = _.find(shows, { id: req.params.id });
    res.send({
      'show': _.extend(show, req.body.show)
    });
  });

  showsRouter.delete('/:id', function(req, res) {
    var index = _.findIndex(shows, { id: req.params.id });
    shows.splice(index, 1);
    res.status(204).end();
  });

  app.use(bodyParser.json());
  app.use('/api/shows', showsRouter);
};
