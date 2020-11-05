import { map, find, curry } from 'ramda'

const selectBySelector = curry(function select(selector, id, futureData) {
  return map(find(({ [selector]: given }) => id === given))(futureData)
})

export default selectBySelector
