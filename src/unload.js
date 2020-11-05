const T = require('torpor')
const { assocPath, map, __, curry, chain, pipe } = require('ramda')
const { trace } = require('xtrace')
const { fork } = require('fluture')

const announceBackupWithConfig = curry(function _announceBackupWithConfig(
  server,
  x
) {
  trace('data saved...', x)
  // kill connection
  server.close(() => {
    process.exit(0)
  })
  // force kill connection
  setTimeout(() => process.exit(2), 5e3)
})
const errorOnExit = (e) => {
  trace('error on exiting', e)
  process.exit(1)
}

/**
 * @example
 * @param server
 * @param config
 */
function onUnloadWithConfig(server, config) {
  return () => {
    const oldThoughts = T.readFile(config.STORAGE.BRAIN)
    const newThoughts = T.writeFile(config.STORAGE.BACKUP, __, 'utf8')
    pipe(
      oldThoughts,
      map(
        pipe(
          trace('saving state on exit...'),
          JSON.parse,
          assocPath(['meta', 'modified'], new Date().toString()),
          (x) => JSON.stringify(x, null, 2)
        )
      ),
      chain(newThoughts),
      fork(errorOnExit)(announceBackupWithConfig(server))
    )('utf8')
  }
}

module.exports = onUnloadWithConfig
