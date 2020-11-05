const {trace, configure, fork} = require('maitre-d')

const serverF = configure({
  // passed directly to `cors`
  CORS: {
    origin: true,
    credentials: true
  },
  // what port should we run on?
  PORT: 1234,
  STORAGE: {
    ACCESS_PATH: ['data', 'id'],
    // what data should we load on mount / unmount?
    BRAIN: 'data.json',
    BACKUP: 'data-backup.json' // if omitted, would be `data.json.bak`,
    // passed to `body-parser` as {limit, type}
    LIMIT: '50mb',
    TYPE: 'application/json'
  },
  onPostRoot: config => (req, res, next) => {
    const { points, name } = req.body
      pipe(
        JSON.stringify,
        T.writeFile(`./${slugify(name)}.json`, __, "utf8"),
        fork(next)(() => res.json({ saved: true }))
      )({
        points,
        meta: {
          modified: new Date().toString(),
        },
      })
  }
})

fork(
  trace('something went wrong')
)(
  ({config}) => trace('listening on ' + config.PORT)
)(serverF)
