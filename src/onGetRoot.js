const { map, pipe } = require('ramda')
const { fork } = require('fluture')

const readFileOr = require('./readFileOr')
const defaultDataFrom = require('./default-data')

const onGetRoot = (CONFIG) => {
  const forceReadFile = readFileOr(defaultDataFrom(CONFIG))
  return function defaultJSONResponse(req, res, next) {
    const { STORAGE } = CONFIG
    const finish = (x) => res.json(x)
    pipe(forceReadFile, map(JSON.parse), fork(next)(finish))(STORAGE.BRAIN)
  }
}

module.exports = onGetRoot
