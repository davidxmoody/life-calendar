const {AppContainer} = require('react-hot-loader')
const React = require('react')
const ReactDOM = require('react-dom')
import App from './App'

const mountApp = document.getElementById('main-content')

ReactDOM.render(<AppContainer component={App} />, mountApp)

if (module.hot) {
  module.hot.accept('./App', () => {
    ReactDOM.render(
      <AppContainer component={require('./App').default} />,
      mountApp
    )
  })
}
