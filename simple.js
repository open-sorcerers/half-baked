const md = require('./src/maitre-d')
const F = require('fluture')

F.fork(console.warn)(() => console.log('Loaded!'))(md())
