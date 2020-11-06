import path from 'path'
import { fork } from 'fluture'
import T from 'torpor'
// import why from 'why-is-node-running'
import updateFile from './updateFile'

const THE_FILE = path.resolve(__dirname, 'updateFile.bak')

beforeAll((done) => {
  fork(done)(() => done())(T.writeFile(THE_FILE, '{"cool": "so-true"}', 'utf8'))
})
test('updateFile', (done) => {
  fork(done)(() => done())(
    updateFile(THE_FILE, (raw) => {
      expect(raw).toEqual({ cool: 'so-true' })
      return Object.assign({}, raw, { smooky: 'boogy' })
    })
  )
})
