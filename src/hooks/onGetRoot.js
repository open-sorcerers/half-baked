import { map, pipe } from 'ramda'
import { fork } from 'fluture'

import defaultDataFrom from '../default-data'
import readFileOr from '../utils/readFileOr'

const onGetRoot = (CONFIG) => {
  const forceReadFile = readFileOr(defaultDataFrom(CONFIG))
  return function defaultJSONResponse(req, res, next) {
    const { STORAGE } = CONFIG
    const finish = (x) => res.json(x)
    pipe(forceReadFile, map(JSON.parse), fork(next)(finish))(STORAGE.BRAIN)
  }
}

export default onGetRoot
