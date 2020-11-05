const onCancel = require('./onCancel')
const onGetId = require('./onGetId')
const onGetRoot = require('./onGetRoot')
const onPostId = require('./onPostId')
const onPostRoot = require('./onPostRoot')

const { APPLICATION_JSON } = require('./constants')

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

module.exports = DEFAULT_CONFIG
