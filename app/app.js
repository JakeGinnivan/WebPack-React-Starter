import React from 'react'
import routes from './routes'
import { Router } from 'react-router'
import './app.scss'

const App = ({ history }) => (
  <Router history={history}>
    {routes}
  </Router>
)
App.propTypes = {
  history: React.PropTypes.object.isRequired
}

export default App
