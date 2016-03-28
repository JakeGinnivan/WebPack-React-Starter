import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'

const dest = document.getElementById('app')

if (process.env.NODE_ENV !== 'production') {
  window.React = React // enable debugger
}

let render = () => {
  let App = require('./app').default
  ReactDOM.render(<App history={browserHistory} />, dest)
}

// If hot reload is enabled then accept changes to ./app and
// re-render the app if there are no render errors
if (module.hot) {
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react')
    ReactDOM.render(
      <RedBox error={error} />,
      dest
    )
  }
  render = () => {
    try {
      renderApp()
    } catch (error) {
      renderError(error)
    }
  }
  module.hot.accept('./app', () => {
    setTimeout(render)
  })
}

render()
