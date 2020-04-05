const debug = require('debug')('tvapi:util')

const convert = (conversions) => (items) => {
  return items.map((item) => {
    debug('-----')
    debug('convert %o', item)

    return conversions.reduce((memo, conversion) => {
      debug('conversion %o', conversion)

      const transform = conversion.transform || ((a) => a)
      const value = item[conversion.originalProperty] || conversion.default
      const transformedValue = transform(value)

      memo[conversion.preferredProperty] = transformedValue

      debug('result:', transformedValue)

      return memo
    }, {})
  })
}

module.exports = {
  convert,
}
