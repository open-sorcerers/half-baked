import { map, pipe, find, curry } from 'ramda'

const notEmpty = (x) => Object.values(x).filter((z) => z).length > 0

const selectBySelectorOr = curry(function select(or, selector, id, futureData) {
  return pipe(
    map(find(({ [selector]: given }) => id === given)),
    (z) => (notEmpty(z) ? z : or)
  )(futureData)
})

export default selectBySelectorOr
