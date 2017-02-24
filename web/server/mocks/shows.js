var moment = require('moment')
var _ = require('lodash')
var generator = require('../shows-generator')

module.exports = function(app, express) {
  var showsRouter = express.Router()

  var showsAndEpisodes = generator.showsAndEpisodes(30)
  var shows = showsAndEpisodes.shows
  var episodes = showsAndEpisodes.episodes

  showsRouter.get('/', function(req, res) {
    res.send({
      'shows': shows,
      'episodes': episodes
    })
  })

  showsRouter.post('/', function(req, res) {
    var show = _.extend(req.body.show, { id: generator.incShowId() })
    var newEpisodes = generator.seasons(_.random(1, 8))
    show.episode_ids = _.map(newEpisodes, 'id')
    shows.push(show)
    episodes = episodes.concat(newEpisodes)
    res
      .status(201)
      .send({
        'show': show,
        'episodes': newEpisodes
      })
  })

  showsRouter.get('/:id', function(req, res) {
    res.send({
      'show': _.find(shows, { id: Number(req.params.id) })
    })
  })

  showsRouter.put('/:id', function(req, res) {
    var show = _.find(shows, { id: Number(req.params.id) })
    res.send({
      'show': _.extend(show, req.body.show)
    })
  })

  showsRouter.delete('/:id', function(req, res) {
    var index = _.findIndex(shows, { id: Number(req.params.id) })
    if (index >= 0) {
      shows.splice(index, 1)
    }
    res.status(204).end()
  })

  app.use('/api/shows', showsRouter)
}
