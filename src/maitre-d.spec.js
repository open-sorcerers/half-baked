// import { flexeca } from 'flexeca'
// import execa from 'execa'
import why from 'why-is-node-running'
import axios from 'axios'
import { fork } from 'fluture'
import maitreD from './index'

describe("servers, who needs 'em?", () => {
  let saved
  const sockets = []

  const bind = (d) => ({ app, state }) => {
    // server = app.listen(2345, d)
    state.server.on('connection', (socket) => {
      sockets.push(socket)
    })
    saved = state
    d()
  }

  const masterServer = maitreD({
    PORT: 2345,
    logging: false
  })

  beforeAll((done) => {
    fork(done)(bind(done))(masterServer)
  })
  afterAll((done) => {
    if (saved && saved.server) {
      saved.server.removeAllListeners()
      saved.server.unref()
      saved.server.close(() => {
        saved.onUnload()
        done()
        // process.exit(0) // or `--forceExit`
      })
    }
  })

  test('GET /', (done) => {
    return axios({ method: 'get', url: 'http://localhost:2345' })
      .catch(done)
      .then((out) => {
        expect(out.data).toMatchSnapshot()
        // stop()
        done()
      })
  })
})
