module.exports = function(app, express) {
  var router = express.Router();
  router.use(function (req, res, next) {
    if (req.headers.api_key === '' || req.headers.api_key === 'nope') {
      return res.status(401).end();
    }
    next();
  });
  app.use('/api/static', express.static(__dirname + '/static'));
  app.use('/api', router);
};
