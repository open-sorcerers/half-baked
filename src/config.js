import { APPLICATION_JSON } from './constants'

import onCancel from './hooks/onCancel'
import onGetId from './hooks/onGetId'
import onGetRoot from './hooks/onGetRoot'
import onPostId from './hooks/onPostId'
import onPostRoot from './hooks/onPostRoot'

const DEFAULT_CONFIG = Object.freeze({
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
