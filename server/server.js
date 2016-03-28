/* eslint-env node */
/* eslint no-var: 0, func-names: 0, prefer-arrow-callback: 0, no-console: 0 */
'use-strict'

var express = require('express')
var bundlePort = process.env.hot ? process.env.HOT_PORT : process.env.PORT
var app = express()

app.use('*', function (req, res) {
  res.set('content-type', 'text/html')
  res.send(`<!doctype html>
<html lang='en-us'>
  <head>
    <link rel='shortcut icon' href='/favicon.ico' />
    <meta charSet='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
    <meta httpEquiv='x-ua-compatible' content='ie=edge' />
    <title>universal-react</title>
  </head>
  <body>
    <div id="app"></div>
    <script src='http://localhost:${bundlePort}/dist/bundle.js' charSet='UTF-8'></script>
  </body>
</html>`)
  res.end()
})

app.listen(process.env.PORT, 'localhost', function (err) {
  if (err) {
    console.log(err)
    return
  }

  console.log(`Listening at http://localhost:${process.env.PORT}`)
})
