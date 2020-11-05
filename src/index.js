import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import pino from 'pino'
import pinoHttp from 'pino-http'
import { merge, pipe, map } from 'ramda'
import { Future } from 'fluture'

import DEFAULT_CONFIG from './config'
import { APPLICATION_JSON } from './constants'
import onLoadWithConfig from './lifecycle/load'
import onUnloadWithConfig from './lifecycle/unload'

const relativePath = (x) => path.resolve(__dirname, x)

// head requests must return 204
const corsHead204 = (req, res) => {
  res.sendStatus(204)
}

function configureMaitreD(rawConfig = DEFAULT_CONFIG) {
  return new Future(function configuredServer(bad, good) {
    const CONFIG = pipe(merge(DEFAULT_CONFIG), Object.freeze)(rawConfig)
    const {
      STORAGE,
      CORS,
      onGetRoot,
      onPostRoot,
      onGetId,
      onPostId,
      onCancel,
      logging
    } = CONFIG
    const { BRAIN: _BRAIN, BACKUP: _BACKUP, LIMIT: limit, TYPE: type } = STORAGE

    const app = express()
    app.locals.title = "Maître d'Serveur"
    if (logging) {
      app.use(
        pinoHttp({
          logger: pino({ name: 'maitre-d' })
        })
      )
    }
    // cors
    app.use(cors(CORS))
    // json
    if (type === APPLICATION_JSON) {
      app.use(bodyParser.json({ limit, type }))
    }

    const LOCALIZED_STORAGE = map(relativePath, {
      BRAIN: _BRAIN,
      BACKUP: _BACKUP
    })

    const LOCALIZED_CONFIG = Object.freeze(
      merge(CONFIG, { STORAGE: merge(STORAGE, LOCALIZED_STORAGE) })
    )

    const onLoad = onLoadWithConfig(LOCALIZED_CONFIG)
    const server = app.listen(CONFIG.PORT, onLoad)
    const onUnload = onUnloadWithConfig(server, LOCALIZED_CONFIG)

    process.on('SIGTERM', onUnload)
    process.on('SIGINT', onUnload)

    app.head('/', corsHead204)
    app.get('/', onGetRoot(LOCALIZED_CONFIG))
    app.post('/', onPostRoot(LOCALIZED_CONFIG))

    app.head('/:id', corsHead204)
    app.get('/:id', onGetId(LOCALIZED_CONFIG))
    app.post('/:id', onPostId(LOCALIZED_CONFIG))
    good(app)
    return onCancel(LOCALIZED_CONFIG)
  })
}

export default configureMaitreD