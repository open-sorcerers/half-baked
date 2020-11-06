import { addModifiedBy } from './unload'

test('addModifiedBy', () => {
  const input = `{"dope": "cool"}`
  const output = JSON.parse(addModifiedBy(input))
  expect(Object.keys(output.meta)).toEqual(['modified'])
})
