import { curry, pipe, map, __ } from 'ramda'
import { chain } from 'fluture'
import { readFile, writeFile } from 'torpor'

const j0 = (x) => JSON.stringify(x, null, 2)

export const updateFile = curry(function _updateFile(filepath, update) {
  return pipe(
    readFile(__, 'utf8'),
    map(pipe(JSON.parse, update, j0)),
    chain(writeFile(filepath, __, 'utf8'))
  )(filepath)
})

export default updateFile
