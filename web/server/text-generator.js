var _ = require('lodash')
var bacon = require('baconipsum')

module.exports = function (min, max) {
  var words = bacon(_.random(min, max))
  return words.replace(/\./g, '')
}
