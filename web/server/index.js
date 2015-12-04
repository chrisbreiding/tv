module.exports = function(app, express) {
  var router = express.Router();
  router.use(function (req, res, next) {
    if (req.headers.api_key !== 'apikey') {
      return res.status(401).end();
    }
    next();
  });
  app.use('/api', router);
};
