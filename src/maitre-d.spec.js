// import { flexeca } from 'flexeca'
// import execa from 'execa'
import why from 'why-is-node-running'
import axios from 'axios'
import { fork, cache } from 'fluture'
import maitreD from './index'

describe("servers, who needs 'em?", () => {
  let server
  let stop

  const masterServer = cache(
    maitreD({
      PORT: 2345,
      logging: false,
      autoListen: false,
      onCancel: (conf) => () => {
        console.log('this was cancelled')
      }
    })
  )

  beforeAll((done) => {
    stop = fork(done)(({ app }) => {
      server = app.listen(2345, done)
    })(masterServer)
  })
  afterAll((done) => {
    if (server && server.close) {
      server.unref()
      server.close(() => {
        console.log('barf?')
        done()
      })
      console.log('METH', Object.keys(server))
    }
  })

  test('GET /', (done) => {
    axios({ method: 'get', url: 'http://localhost:2345' })
      .catch(done)
      .then((out) => {
        expect(out.data).toMatchSnapshot()
        done()
      })
  })
})
