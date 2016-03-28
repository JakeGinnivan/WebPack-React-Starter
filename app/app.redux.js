import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

// Main reducer
const appReducer = (state = {}) => state

const reducers = combineReducers({
  routing: routerReducer,
  app: appReducer
})
export default reducers
