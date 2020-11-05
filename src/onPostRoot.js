const { writeFile } = require('torpor')
const { __, pipe } = require('ramda')
const { fork } = require('fluture')

module.exports = (config) => (req, res, next) => {
  const finish = () => res.json({ saved: true })
  pipe(
    (x) => JSON.stringify(x),
    writeFile(config.STORAGE.BRAIN, __, 'utf8'),
    fork(next)(finish)
  )(req.body)
}
