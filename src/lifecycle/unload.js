import T from 'torpor'
import { assocPath, map, __, curry, chain, pipe } from 'ramda'
import { fork } from 'fluture'

const announceBackupWithConfig = curry(function _announceBackupWithConfig(
  server,
  x
) {
  // kill connection
  server.close(() => {
    process.exit(0)
  })
  // force kill connection
  setTimeout(() => process.exit(2), 5e3)
})
const errorOnExit = (e) => {
  process.exit(1)
}

function onUnloadWithConfig(server, config) {
  return () => {
    const oldThoughts = T.readFile(config.STORAGE.BRAIN)
    const newThoughts = T.writeFile(config.STORAGE.BACKUP, __, 'utf8')
    pipe(
      oldThoughts,
      map(
        pipe(
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

export default onUnloadWithConfig
