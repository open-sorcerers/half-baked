const { map, find, curry } = require('ramda')

const selectBySelector = curry(function select(selector, id, futureData) {
  return map(find(({ [selector]: given }) => id === given))(futureData)
})

module.exports = selectBySelector
