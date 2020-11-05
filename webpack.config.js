module.exports = {
  module: {
    loaders: [{ exclude: ['node_modules'], loader: 'babel' }]
  },
  resolve: {
    extensions: ['', 'js'],
    modules: ['node_modules']
  }
}
