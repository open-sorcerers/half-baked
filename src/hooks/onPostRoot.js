import { writeFile } from 'torpor'
import { __, pipe } from 'ramda'
import { fork } from 'fluture'

const onPostRoot = (config) => (req, res, next) => {
  const finish = () => res.json({ saved: true })
  pipe(
    (x) => JSON.stringify(x),
    writeFile(config.STORAGE.BRAIN, __, 'utf8'),
    fork(next)(finish)
  )(req.body)
}

export default onPostRoot
