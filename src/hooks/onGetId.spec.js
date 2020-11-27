import path from 'path'
import onGetId from './onGetId'

const NO_MATCH = 'unable-to-find-this'

test('onGetId - missing', (done) => {
  const raw = {
    STORAGE: {
      // ACCESS_PATH: ['data', 'id'],
      BRAIN: '../../half-bakedata.json'
    },
    CONSTANTS: { NO_MATCH }
  }
  const req = {
    params: {
      id: 'lookup'
    }
  }
  const res = {
    sendStatus: (output) => {
      expect(output).toEqual(404)
      done()
    }
  }
  const next = done
  onGetId(raw)(req, res, next)
})

test('onGetId - /:id cool', (done) => {
  const raw = {
    STORAGE: {
      ACCESS_PATH: ['data', 'id'],
      BRAIN: path.resolve(__dirname, '../../half-bakedata.json')
    },
    CONSTANTS: { NO_MATCH }
  }
  const req = {
    params: {
      id: 'cool'
    }
  }
  const res = {
    sendStatus: done,
    json: (output) => {
      expect(output.data).toMatchSnapshot()
      done()
    }
  }
  const next = done
  onGetId(raw)(req, res, next)
})
