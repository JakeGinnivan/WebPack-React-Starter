/* eslint-env node */

import express from 'express'
import path from 'path'
import thunk from 'redux-thunk'
import { match, RouterContext } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import createHistory from 'react-router/lib/createMemoryHistory'
import routes from '../app/routes'
import reducers from '../app/app.redux'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import React from 'react'

const bundlePort = process.env.hot ? process.env.HOT_PORT : process.env.PORT
const app = express()

app.use(express.static(path.join(__dirname, '..', 'dist')))

// Create redux store
const middleware = [thunk]
let finalCreateStore
if (global.__DEV__) {
  finalCreateStore = compose(
    applyMiddleware(...middleware),
    // Add support for Redux devtools chrome extension
    window.devToolsExtension ? window.devToolsExtension() : _ => _
  )(createStore)
} else {
  finalCreateStore = applyMiddleware(...middleware)(createStore)
}
const store = finalCreateStore(reducers)

app.use((req, res) => {
  const history = createHistory(req.originalUr)

  match({ history, routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      const serverRender = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )

      res.set('content-type', 'text/html')
      res.status(200).send(`<!doctype html>
<html lang='en-us'>
  <head>
    <link rel='shortcut icon' href='/favicon.ico' />
    <meta charSet='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
    <meta httpEquiv='x-ua-compatible' content='ie=edge' />
    <title>universal-react</title>
  </head>
  <body>
    <div id="app">${serverRender}</div>
    <script src='http://localhost:${bundlePort}/dist/bundle.js' charSet='UTF-8'></script>
  </body>
</html>`)
      res.end()
    } else {
      res.status(404).send('Not found')
    }
  })
})

app.listen(process.env.PORT, 'localhost', function (err) {
  if (err) {
    console.log(err)
    return
  }

  console.log(`Listening at http://localhost:${process.env.PORT}`)
})
