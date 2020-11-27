import path from 'path'
// import { flexeca } from 'flexeca'
// import execa from 'execa'
// import why from 'why-is-node-running'
import { assocPath, pipe, map, __ } from 'ramda'
import axios from 'axios'
import { fork } from 'fluture'
import T from 'torpor'
import halfBaked from './index'

describe("servers, who needs 'em?", () => {
  let saved
  let server
  // let sockets = []

  const bind = (d) => ({ app, state }) => {
    // server = app.listen(2345, d)
    // state.server.on('connection', (socket) => {
    //   sockets.push(socket)
    // })
    saved = state
    d()
  }

  const masterServer = halfBaked({
    PORT: 2345
    // logging: true
    // autoListen: false
  })

  beforeAll((done) => {
    fork(done)(bind(done))(masterServer)
  })
  afterAll((done) => {
    // sockets.forEach((s) => s.destroy())
    // sockets = []
    const savedServer = (saved && saved.server) || server
    if (savedServer) {
      savedServer.removeAllListeners()
      savedServer.unref()
      savedServer.close(() => {
        if (savedServer.onUnload) {
          savedServer.onUnload()
        }
        done()
        // process.exit(0) // or `--forceExit`
      })
    }
  })

  test('HEAD /', (done) => {
    return axios({ method: 'head', url: 'http://localhost:2345' })
      .catch(done)
      .then((out) => {
        expect(out.status).toEqual(204)
        done()
      })
  })

  test(' GET /', (done) => {
    return axios({ method: 'get', url: 'http://localhost:2345' })
      .catch(done)
      .then((out) => {
        expect(out.data.data).toMatchSnapshot()
        done()
      })
  })

  test('POST /', (done) => {
    pipe(
      T.readFile(__, 'utf8'),
      map(JSON.parse),
      fork(done)((raw) => {
        const data = assocPath(['meta', 'last-modified'], Date.now(), raw)
        return axios({
          method: 'post',
          url: 'http://localhost:2345',
          data
        })
          .catch(done)
          .then((out) => {
            done()
          })
      })
    )(path.resolve(__dirname, '../half-bakedata.json'))
  })

  test('HEAD /:id - cool', (done) => {
    return axios({ method: 'head', url: 'http://localhost:2345/cool' })
      .catch(done)
      .then((out) => {
        expect(out.status).toEqual(204)
        done()
      })
  })

  test(' GET /:id - cool', (done) => {
    return axios({ method: 'get', url: 'http://localhost:2345/cool' })
      .catch(done)
      .then((out) => {
        expect(out.data).toMatchSnapshot()
        done()
      })
  })
})
