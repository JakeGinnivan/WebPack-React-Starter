import React from 'react'
import { Link } from 'react-router'

const AppContainer = ({ children }) => (
  <div>
    <header>
      <Link to='/'>Home</Link>
      <Link to='/about'>About</Link>
    </header>
    <div>
      {children}
    </div>
  </div>
)

AppContainer.propTypes = {
  children: React.PropTypes.any.isRequired
}

export default AppContainer
