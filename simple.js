const F = require('fluture')
const hb = require('./half-baked')

F.fork(console.warn)(({ config }) => {
  const storage = `(${config.STORAGE.BRAIN})`
  const accessPath = config.STORAGE.ACCESS_PATH
  const accessString = accessPath.slice(0, -1).join('.') + '[id]'
  const host = `http://localhost:${config.PORT}`
  console.log(`
                ___     __             ___  __
|__|  /\\  |    |__  __ |__)  /\\  |__/ |__  |  \
|  | /~~\\ |___ |       |__) /~~\\ |  \\ |___ |__/
======== ${host} ==================================
    HEAD ${host}/    ~ 204
    GET  ${host}/    ~ 200 + ${storage}
    HEAD ${host}/:id ~ 204
    GET  ${host}/:id ~ 200 + ${storage}.${accessString}
`)
})(hb({ logging: true }))
