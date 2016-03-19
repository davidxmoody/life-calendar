module.exports = {
  entry: './src/main.js',
  output: {
    path: './build',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel'},
      {test: /\.json$/, exclude: /node_modules/, loader: 'json'},
      {test: /\.css$/, loader: 'style!css?modules!autoprefixer'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json', '.css']
  }
}
