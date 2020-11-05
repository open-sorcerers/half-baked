import { map, pipe, last } from 'ramda'
import { fork } from 'fluture'

import readFileOr from '../utils/readFileOr'
import selectBySelector from '../utils/selectBySelector'

const onGetId = ({ STORAGE }) => (req, res, next) => {
  const sel = last(STORAGE.ACCESS_PATH)
  const finish = (x) => res.json(x)
  pipe(
    readFileOr({}),
    map(JSON.parse),
    selectBySelector(sel, req.params[sel]),
    fork(next)(finish)
  )(STORAGE.BRAIN)
}

export default onGetId
