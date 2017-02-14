import _ from 'lodash'

const pad = (num) => num < 10 ? `0${num}` : `${num}`

const msToTime = (ms) => {
  if (!_.isNumber(ms)) return '--:--'

  const hours = Math.floor(ms / (1000 * 60 * 60))
  ms = ms - (hours * 1000 * 60 * 60)
  const minutes = Math.floor(ms / (1000 * 60))
  ms = ms - (minutes * 1000 * 60)
  const seconds = Math.floor(ms / 1000)
  const hoursString = hours > 0 ? `${hours}:` : ''
  return `${hoursString}${pad(minutes)}:${pad(seconds)}`
}

export default {
  pad,
  msToTime,
}
