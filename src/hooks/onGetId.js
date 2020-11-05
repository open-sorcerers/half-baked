import { map, tap, pipe, last } from 'ramda'
import { fork } from 'fluture'

import readFileOr from '../utils/readFileOr'
import selectEntityOr from '../utils/selectEntityOr'

const onGetId = ({ STORAGE, CONSTANTS }) => (req, res, next) => {
  const { NO_MATCH: NOT_FOUND } = CONSTANTS
  const entity = last(STORAGE.ACCESS_PATH)
  const finish = (x) => (x[NOT_FOUND] ? res.sendStatus(404) : res.json(x))
  pipe(
    readFileOr({}),
    map(
      pipe(
        JSON.parse,
        selectEntityOr({ [NOT_FOUND]: true }, entity, req.params[entity])
      )
    ),
    fork(next)(finish)
  )(STORAGE.BRAIN)
}

export default onGetId
