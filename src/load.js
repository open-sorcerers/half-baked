const { writeFile } = require('torpor')
const { chain, pipe, __ } = require('ramda')
const { trace } = require('xtrace')
const { fork } = require('fluture')

const readFileOr = require('./readFileOr')
const defaultDataFrom = require('./default-data')

/**
 * onLoadWithConfig
 * @param config - localized config object
 * @returns closured onLoad hook
 */
function onLoadWithConfig(config) {
  const backup = config.STORAGE.BACKUP
  return () => {
    const oldThoughts = readFileOr(defaultDataFrom(config))
    const newThoughts = writeFile(backup, __, 'utf8')
    pipe(
      oldThoughts,
      chain(newThoughts),
      fork(trace('error on load'))(trace('data loaded...'))
    )(config.STORAGE.BRAIN)
  }
}

module.exports = onLoadWithConfig
