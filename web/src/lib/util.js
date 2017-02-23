import _ from 'lodash'

const searchLink = (link, searchName, episodeNumber) => {
  const name = episodeNumber ? `${searchName} ${episodeNumber}` : searchName

  return link
    .replace(/%s/g, name)
    .replace(/\[searchName]/g, name)
}

const pad = (num) => num < 10 ? `0${num}` : `${num}`

const keysTo = (method) => (obj) => {
  return _.transform(obj, (result, value, key) => {
    result[_[method](key)] = value
  })
}

const keysToCamelCase = keysTo('camelCase')
const keysToSnakeCase = keysTo('snakeCase')

export default {
  searchLink,
  pad,
  keysToCamelCase,
  keysToSnakeCase,
}
