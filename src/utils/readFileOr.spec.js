import path from 'path'
import F from 'fluture'
import readFileOr from './readFileOr'

const fff = readFileOr(
  { scooby: 'doo' },
  path.resolve(__dirname, '../jackage.pson')
)

F.fork(console.log)(console.warn)(fff)
