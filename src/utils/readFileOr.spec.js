import path from 'path'
import T from 'torpor'
import F from 'fluture'
import readFileOr from './readFileOr'

const FIXTURE_FILE = path.resolve(__dirname, 'fixture-readFileOr.json.bak')

beforeAll((done) => {
  const removeFixtureF = T.unlink(FIXTURE_FILE)
  F.fork(done)(() => done())(removeFixtureF)
})

const oneOf = (list) => (x = Math.floor(Math.random() * (list.length - 1))) =>
  list[x] || false

const alphabet = ['antelope', 'boar', 'cantelope', 'door']
const j2 = (x) => JSON.stringify(x, null, 2)

test('readFileOr will autogenerate a file', (done) => {
  const input = j2({ [oneOf(alphabet)()]: Math.round(Math.random() * 1e6) })
  const fff = readFileOr(input, FIXTURE_FILE)
  F.fork(done)((output) => {
    expect(output).toEqual(output)
    done()
  })(fff)
})
