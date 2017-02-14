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
  constructor (message, stack) {
    super(message)
    this.isCancellationError = true
    if (stack) this.stack = stack
  }
}

class HandlingError extends Error {
  constructor (message, stack) {
    super(message)
    this.isHandlingError = true
    if (stack) this.stack = stack
  }
}

const wrapCancelationError = (message) => () => {
  throw new CancelationError(message)
}

const wrapHandlingError = (message) => (error) => {
  throw new HandlingError(message, error.message)
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
  CancelationError,
  HandlingError,
  wrapCancelationError,
  wrapHandlingError,
  getPlexToken,
  setPlexToken,
}
