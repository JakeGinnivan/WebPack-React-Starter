/* eslint-env node */
/* eslint no-var: 0, func-names: 0, prefer-arrow-callback: 0, no-console: 0, prefer-template: 0 */
'use-strict'

var path = require('path')
var CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' }
    ]
  },
  output: {
    path: path.resolve(path.join(__dirname, '../dist')),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js'],
    root: [
      path.resolve(path.join(__dirname, '../app'))
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { root: path.normalize(path.join(__dirname, '../')) })
  ]
}

