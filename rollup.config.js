import path from 'path'
import alias from '@rollup/plugin-alias'
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import { map, pipe } from 'ramda'

import pkg from './package.json'

const mapLocal = pipe(
  map((z) =>
    Object.assign({}, z, {
      replacement: path.resolve(__dirname, z.replacement)
    })
  )
)

const terserConfig = {
  mangle: {
    keep_fnames: true
  },
  compress: {
    keep_fargs: true,
    hoist_funs: true
  },
  keep_fnames: true
}

const plugins = [
  babel(),
  resolve({ preferBuiltins: true }),
  cjs({ include: /node_modules/ })
]

const THE_MASTER_OF_THE = {
  HOUSE: 'src/index.js'
}
const buildFor = (input) => {
  const name = `maitre-d`
  const out = [
    {
      input,
      external: Object.keys(pkg.dependencies).concat(['path']),
      // external: ['path', 'fs'],
      output: {
        exports: 'auto',
        file: `${name}.js`,
        format: `cjs`
      },
      plugins
    }
  ]
  return out
}

export default buildFor(THE_MASTER_OF_THE.HOUSE)
