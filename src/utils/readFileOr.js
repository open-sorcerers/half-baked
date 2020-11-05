import { readFile, writeFile } from 'torpor'
import { map, pipe, curry, __ } from 'ramda'
import { chain, resolve } from 'fluture'

const readFileOr = curry(function _readFileOr(otherwise, pathToFile) {
  const forceFileExistence = (raw) => {
    if (raw === '') {
      return pipe(
        writeFile(__, otherwise, 'utf8'),
        map(() => otherwise)
      )(pathToFile)
    }
    return resolve(raw)
  }
  return pipe(
    readFile(__, { encoding: 'utf8', flag: 'a+' }),
    chain(forceFileExistence)
  )(pathToFile)
})

export default readFileOr
