const md = require('./maitre-d')
const F = require('fluture')

F.fork(console.warn)(console.log)(md())
