const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const opener = require('opener')
const config = require('./webpack.config')
const host = 'localhost'
const port = 3000

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true,
  },
})
.listen(port, host, (err) => {
  if (err) {
    console.log(err)
  }
  console.log(`Listening at ${host}:${port}`)
  opener(`http://${host}:${port}`)
})
