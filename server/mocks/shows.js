module.exports = function(app) {
  var express = require('express');
  var moment = require('moment');
  var _ = require('lodash');
  var bodyParser = require('body-parser');
  var showsRouter = express.Router();

  var shows = [{
    id: '1',
    display_name: 'Show 1',
    search_name: 'Show 1 Search',
    file_name: 'Show 1 File',
    source_id: 'show-1-source',
    episodes: ['1', '2', '3']
  },{
    id: '2',
    display_name: 'Show 2',
    search_name: 'Show 2 Search',
    file_name: 'Show 2 File',
    source_id: 'show-2-source',
    episodes: ['4', '5']
  },{
    id: '3',
    display_name: 'Show 3',
    search_name: 'Show 3 Search',
    file_name: 'Show 3 File',
    source_id: 'show-3-source',
    episodes: ['6', '7', '8', '9']
  },{
    id: '4',
    display_name: 'Show 4',
    search_name: 'Show 4 Search',
    file_name: 'Show 4 File',
    source_id: 'show-4-source',
    episodes: ['10', '11', '12']
  }];

  var episodes = [{
    id: '1',
    season: 1,
    episode_number: 1,
    title: 'First Show First Episode',
    airdate: moment().subtract(2, 'weeks')
  },{
    id: '2',
    season: 1,
    episode_number: 2,
    title: 'First Show Second Episode',
    airdate: moment().subtract(1, 'weeks')
  },{
    id: '3',
    season: 1,
    episode_number: 3,
    title: 'First Show Third Episode',
    airdate: moment()
  },{
    id: '4',
    season: 3,
    episode_number: 1,
    title: 'Second Show First Episode',
    airdate: moment().add(3, 'days')
  },{
    id: '5',
    season: 3,
    episode_number: 2,
    title: 'Second Show Second Episode',
    airdate: moment().add(10, 'days')
  },{
    id: '6',
    season: 1,
    episode_number: 1,
    title: 'Third Show First Episode',
    airdate: moment().subtract(8, 'weeks')
  },{
    id: '7',
    season: 1,
    episode_number: 2,
    title: 'Third Show Second Episode',
    airdate: moment().subtract(7, 'weeks')
  },{
    id: '8',
    season: 1,
    episode_number: 3,
    title: 'Third Show Third Episode',
    airdate: moment().subtract(6, 'weeks')
  },{
    id: '9',
    season: 1,
    episode_number: 4,
    title: 'Third Show Fourth Episode',
    airdate: moment().subtract(5, 'weeks')
  },{
    id: '10',
    season: 5,
    episode_number: 3,
    title: 'Fourth Show Third Episode',
    airdate: moment().subtract(8, 'days')
  },{
    id: '11',
    season: 5,
    episode_number: 4,
    title: 'Fourth Show Fourth Episode',
    airdate: moment().subtract(1, 'days')
  },{
    id: '12',
    season: 5,
    episode_number: 5,
    title: 'Fourth Show Fifth Episode',
    airdate: moment().add(6, 'days')
  }];

  var newEpisodes = [
    [{
      id: '13',
      season: 2,
      episode_number: 7,
      title: 'Fifth Show Seventh Episode',
      airdate: moment().add(20, 'days')
    },{
      id: '14',
      season: 2,
      episode_number: 8,
      title: 'Fifth Show Eighth Episode',
      airdate: moment().add(27, 'days')
    }],[{
      id: '15',
      season: 1,
      episode_number: 1,
      title: 'Sixth Show First Episode',
      airdate: moment().subtract(3, 'days')
    },{
      id: '16',
      season: 1,
      episode_number: 2,
      title: 'Sixth Show Second Episode',
      airdate: moment().add(4, 'days')
    },{
      id: '17',
      season: 1,
      episode_number: 3,
      title: 'Sixth Show Third Episode',
      airdate: moment().add(11, 'days')
    }],[{
      id: '18',
      season: 8,
      episode_number: 1,
      title: 'Seventh Show First Episode',
      airdate: moment().add(30, 'days')
    }]
  ];

  showsRouter.get('/', function(req, res) {
    res.send({
      'shows': shows,
      'episodes': episodes
    });
  });

  var newEpisodeIndex = 0;

  showsRouter.post('/', function(req, res) {
    var ids = _.map(_.pluck(shows, 'id'), Number);
    var highestId = Math.max.apply(null, ids);
    var show = _.extend(req.body.show, { id: '' + (highestId + 1) });
    var episodes = newEpisodes[newEpisodeIndex];
    show.episodes = _.pluck(episodes, 'id');
    newEpisodeIndex = (newEpisodeIndex + 1) > 2 ? 0 : newEpisodeIndex + 1;
    shows.push(show);
    res
      .status(201)
      .send({
        'show': show,
        'episodes': episodes
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
  app.use('/shows', showsRouter);
};
