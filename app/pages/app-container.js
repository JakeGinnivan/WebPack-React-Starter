import React from 'react'
import { Link } from 'react-router'
import styles from './app-container.module.scss'

const AppContainer = ({ children }) => (
  <div>
    <header className={styles.nav}>
      <Link to='/'>Home</Link>
      <Link to='/about'>About</Link>
    </header>
    <div className={styles.content}>
      {children}
    </div>
  </div>
)

AppContainer.propTypes = {
  children: React.PropTypes.any.isRequired
}

export default AppContainer
