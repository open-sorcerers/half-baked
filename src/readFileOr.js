const { readFile, writeFile } = require('torpor')
const { map, pipe, curry, __ } = require('ramda')
const { chain, resolve } = require('fluture')

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

module.exports = readFileOr
