const { fork, chain } = require('fluture')
const { writeFile } = require('torpor')
const { merge, pipe, __ } = require('ramda')

const md = require('./half-baked')

const jj = (nn) => (xx) => JSON.stringify(xx, null, nn)
const j0 = jj(0)
// const j2 = jj(2)

const slugify = (x) => x.toLowerCase().replace(/\W/g, '-')

const CONFIG = {
  PORT: 3001,
  STORAGE: {
    BRAIN: 'bezierk.json',
    BACKUP: 'bezierk.json.bak'
  },
  logging: true,
  onPostRoot: ({ updateBrain }) => (req, res, next) => {
    const { points, name } = req.body
    const file = `${slugify(name)}.json`
    const update = (raw) =>
      merge(raw, { files: (raw.files || []).concat(file) })
    pipe(
      j0,
      writeFile(`./${file}`, __, 'utf8'),
      chain(() => updateBrain(update)),
      fork(next)(() => res.json({ saved: true }))
    )({ points, meta: { modified: new Date().toString() } })
  }
}

fork(console.warn)(({ config }) => {
  const storage = `(${config.STORAGE.BRAIN})`
  const accessPath = config.STORAGE.ACCESS_PATH
  const accessString = accessPath.slice(0, -1).join('.') + '[id]'
  const host = `http://localhost:${config.PORT}`
  console.log(`
 ____  _____ ____  _  _____ ____  _  __
/  _ \\/  __//_   \\/ \\/  __//  __\\/ |/ /
| | //|  \\   /   /| ||  \\  |  \\/||   /
| |_\\\\|  /_ /   /_| ||  /_ |    /|   \\
\\____/\\____\\\\____/\\_/\\____\\\\_/\\_\\\\_|\\_\\

======== ${host} =======================================
    HEAD ${host}/    ~ 204
    GET  ${host}/    ~ 200 + ${storage}
    POST ${host}/    ~ {points, meta: {modified}}
    HEAD ${host}/:id ~ 204
    GET  ${host}/:id ~ 200 + ${storage}.${accessString}
`)
})(md(CONFIG))
