import { map, pipe } from 'ramda'
import { APPLICATION_JSON } from './constants'

import onCancel from './hooks/onCancel'
import onGetId from './hooks/onGetId'
import onGetRoot from './hooks/onGetRoot'
import onPostId from './hooks/onPostId'
import onPostRoot from './hooks/onPostRoot'
const freeze = Object.freeze
const deepFreeze = pipe(map(freeze), freeze)

const DEFAULT_CONFIG = deepFreeze({
  CONSTANTS: {
    NO_MATCH: 'no-matching-entity-found'
  },
  CORS: {
    origin: true,
    credentials: true
  },
  PORT: 1234,
  STORAGE: {
    ACCESS_PATH: ['data', 'id'],
    BRAIN: 'maitre-data.json',
    BACKUP: 'maitre-data.json.bak',
    LIMIT: '50mb',
    TYPE: APPLICATION_JSON
  },
  onCancel,
  onGetId,
  onGetRoot,
  onPostId,
  onPostRoot
})

export default DEFAULT_CONFIG
