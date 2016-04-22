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
import serialize from 'serialize-javascript'

const app = express()

app.use(express.static(path.join(__dirname, '..', 'dist')))

// Create redux store
const middleware = [thunk]
let finalCreateStore
if (global.__DEV__) {
  finalCreateStore = compose(
    applyMiddleware(...middleware)
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
      if (__DEV__) {
        global.webpack_isomorphic_tools.refresh()
      }

      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      const serverRender = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )
      const assets = global.webpack_isomorphic_tools.assets()
      /* styles (will be present only in production with webpack extract text plugin) */
      const stylesheets = Object.keys(assets.styles).map((style) =>
        `<link href='${assets.styles[style]}' media="screen, projection" rel="stylesheet" type="text/css"/>`)

      const inlineStyles = Object.keys(assets.assets)
        .map(k => assets.assets[k])
        .filter(v => v._style)
        .map(v => `<style>${v._style}</style>`)

      const serverState = `<script charSet='UTF-8'>window.__data=${serialize(store.getState())}</script>`
      const bundle = `<script src=${assets.javascript.main} charSet='UTF-8'></script>`

      res.set('content-type', 'text/html')
      res.status(200).send(`<!doctype html>
<html lang='en-us'>
  <head>
    <link rel='shortcut icon' href='/favicon.ico' />
    <meta charSet='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
    <meta httpEquiv='x-ua-compatible' content='ie=edge' />
    <title>universal-react</title>
    ${stylesheets.join('\r\n')}
    ${inlineStyles.join('\r\n')}
  </head>
  <body>
    <div id="app">${serverRender}</div>
    ${serverState}
    ${bundle}
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
