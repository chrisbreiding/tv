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

const handlingError = (title, message = '', type = 'error') => {
  const error = new Error()
  error.isHandlingError = true
  error.title = title
  error.message = message
  error.type = type
  return error
}

const wrapAndThrowError = (title, type) => (error) => {
  throw handlingError(title, error.message, type)
}

const getPlexToken = () => {
  return config.get('plexToken')
}

const setPlexToken = (token) => {
  return config.set('plexToken', token)
}

module.exports = {
  isDev,
  getDirectories,
  setDirectory,
  getWindowSettings,
  updateWindowSettings,
  logError,
  tildeify,
  handlingError,
  wrapAndThrowError,
  getPlexToken,
  setPlexToken,
}
