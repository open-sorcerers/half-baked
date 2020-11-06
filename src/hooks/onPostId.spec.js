import onPostId from './onPostId'

test('onPostId', (done) => {
  const raw = {}
  const req = {
    params: {
      id: 'lookup'
    }
  }
  const res = {
    send: (output) => {
      expect(output).toEqual(200)
      done()
    }
  }
  const next = done
  onPostId(raw)(req, res, next)
})
