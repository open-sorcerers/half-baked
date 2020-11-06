import T from 'torpor'
import { assocPath, map, __, curry, chain, pipe } from 'ramda'
import { fork } from 'fluture'

const j2 = (x) => JSON.stringify(x, null, 2)

/* istanbul ignore next */
export const announceBackupWithConfig = curry(
  function _announceBackupWithConfig(server, x) {
    server.close(() => {
      process.exit(0)
    })
    setTimeout(() => process.exit(2), 5e3)
  }
)
/* istanbul ignore next */
export const errorOnExit = (e) => {
  console.log('ERROR?', e)
  process.exit(1)
}

export const addModifiedBy = (x) =>
  pipe(
    JSON.parse,
    assocPath(['meta', 'modified'], new Date().toString()),
    j2
  )(x)

/* istanbul ignore next */
export function onUnloadWithConfig(server, config) {
  return () => {
    const oldThoughts = T.readFile(config.STORAGE.BRAIN)
    const newThoughts = T.writeFile(config.STORAGE.BACKUP, __, 'utf8')
    pipe(
      oldThoughts,
      map(addModifiedBy),
      chain(newThoughts),
      fork(errorOnExit)(announceBackupWithConfig(server))
    )('utf8')
  }
}

export default onUnloadWithConfig
