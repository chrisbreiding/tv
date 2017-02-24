var moment = require('moment')
var _ = require('lodash')

module.exports = function(app, express) {
  var router = express.Router()

  var setting = {
    id: '1',
    view_link: 'http://example.com/q=%s',
    last_updated: moment().subtract(5, 'hours').toISOString()
  }

  router.get('/:id', function(req, res) {
    res.send({
      'setting': setting
    })
  })

  router.put('/:id', function(req, res) {
    res.send({
      'setting': _.extend(setting, req.body.setting)
    })
  })

  app.use('/api/settings', router)
}
