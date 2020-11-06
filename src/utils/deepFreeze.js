import {pipe, map} from 'ramda'
const freeze = Object.freeze
const deepFreeze = pipe(map(freeze), freeze)

export default deepFreeze
