module.exports = {
  entry: './src/main.js',
  output: {
    path: './build',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.json$/, exclude: /node_modules/, loader: 'json-loader'},
      {test: /\.css$/, loader: 'style-loader!css-loader!autoprefixer-loader'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json', '.css']
  }
}
