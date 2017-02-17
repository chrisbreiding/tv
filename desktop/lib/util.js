'use strict'

const _ = require('lodash')
const chalk = require('chalk')
const Config = require('electron-config')
const homedir = require('homedir')()

const config = new Config()
const isDev = process.env.NODE_ENV === 'development'

const getDirectories = () => {
  return config.get('directories') || {}
}

const setDirectory = (directory, directoryPath) => {
  config.set('directories', _.extend({}, getDirectories(), {
    [directory]: directoryPath,
  }))
}

const getWindowSettings = () => {
  return config.get('window') || {
    width: 600,
    height: (isDev ? 700 : 400),
  }
}

const updateWindowSettings = (newSettings) => {
  config.set('window', _.extend(getWindowSettings(), newSettings))
}

const logError = (error, ...message) => {
  if (message && message.length) console.error(chalk.red(message.join(' '))) // eslint-disable-line no-console
  console.error(chalk.red(error)) // eslint-disable-line no-console
}

const tildeify = (directory) => {
  return directory.replace(homedir, '~')
}

class CancelationError extends Error {
  constructor (message, details) {
    super(message)
    this.isCancellationError = true
    this.details = details
  }
}

const wrapCancelationError = (message) => () => {
  throw new CancelationError(message)
}

const notCancelationError = (error) => !error.isCancellationError

class HandlingError extends Error {
  constructor (message, details, stack) {
    super(message)
    this.isHandlingError = true
    this.details = details
    this.stack = stack
  }
}

const wrapHandlingError = (message) => (error) => {
  throw new HandlingError(message, error.message, error.stack)
}

const getPlexToken = () => {
  return config.get('plexToken')
}

const setPlexToken = (token) => {
  return config.set('plexToken', token)
}

const pad = (num) => num < 10 ? `0${num}` : `${num}`
const standardizeName = (name) => name.replace(/[ \'\"\.\-]/g, '').toLowerCase()
const matchesEpisodeName = (episode, name) => {
  name = standardizeName(name)
  const showName = standardizeName(episode.show.searchName)
  const season = episode.season
  const epNum = episode.episode_number
  const paddedSeason = pad(season)
  const paddedEpNum = pad(epNum)
  const seasonAndEpisodes = [
    `${season}${epNum}`,
    `${season}${paddedEpNum}`,
    `${paddedSeason}${paddedEpNum}`,
    `s${season}e${epNum}`,
    `s${season}e${paddedEpNum}`,
    `s${paddedSeason}e${paddedEpNum}`,
  ]

  return (
    _.includes(name, showName) &&
    _.some(seasonAndEpisodes, _.partial(_.includes, name))
  )
}

module.exports = {
  isDev,
  getDirectories,
  setDirectory,
  getWindowSettings,
  updateWindowSettings,
  logError,
  tildeify,
  CancelationError,
  wrapCancelationError,
  notCancelationError,
  HandlingError,
  wrapHandlingError,
  getPlexToken,
  setPlexToken,
  pad,
  matchesEpisodeName,
}
