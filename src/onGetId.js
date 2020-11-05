const { map, pipe, last } = require('ramda')
const { fork } = require('fluture')
const readFileOr = require('./readFileOr')
const selectBySelector = require('./selectBySelector')

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

module.exports = onGetId
