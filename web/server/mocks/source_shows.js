var moment = require('moment');
var _ = require('lodash');
var textGen = require('../text-generator');

module.exports = function(app, express) {
  var sourceShowsRouter = express.Router();

  var shows = _.map(_.range(25, 45), function (id) {
    return {
      id: id,
      name: textGen(1, 4),
      description: textGen(10, 30),
      first_aired: moment()
                    .subtract(_.random(1, 10), 'years')
                    .subtract(_.random(1, 20), 'days')
                    .startOf('day')
                    .toISOString(),
      network: textGen(1).substr(0, 3).toUpperCase(),
      banner: '/api/static/banner-' + _.random(1, 4) + '.png'
    };
  });

  sourceShowsRouter.get('/', function(req, res) {
    res.send({
      'source_shows': req.query.query === 'none' ? [] : _.sampleSize(shows, _.random(2, 10))
    });
  });

  app.use('/api/source_shows', sourceShowsRouter);
};
