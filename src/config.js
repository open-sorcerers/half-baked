import { APPLICATION_JSON } from './constants'

import onCancel from './hooks/onCancel'
import onGetId from './hooks/onGetId'
import onGetRoot from './hooks/onGetRoot'
import onPostId from './hooks/onPostId'
import onPostRoot from './hooks/onPostRoot'
import deepFreeze from './utils/deepFreeze'

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
    BRAIN: 'half-bakedata.json',
    BACKUP: 'half-bakedata.json.bak',
    LIMIT: '50mb',
    TYPE: APPLICATION_JSON
  },
  autoListen: true,
  onLoad: false,
  onCancel,
  onGetId,
  onGetRoot,
  onPostId,
  onPostRoot
})

export default DEFAULT_CONFIG
