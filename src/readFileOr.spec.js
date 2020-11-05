const path = require('path')
const F = require('fluture')
const readFileOr = require('./readFileOr')

const fff = readFileOr(
  { scooby: 'doo' },
  path.resolve(__dirname, 'package.spore')
)

F.fork(console.log)(console.warn)(fff)
