/* eslint-env node */
/* eslint no-var: 0, func-names: 0, prefer-arrow-callback: 0, no-console: 0, prefer-template: 0 */
'use-strict'

var webpack = require('webpack')
var config = require('./webpack.config.base')

config.devtool = 'source-map'
config.entry = './app/index'
config.output.filename = 'bundle.[chunkhash].js'

config.plugins.push(
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    __DEV__: false,
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      screw_ie8: true
    }
  })
)

module.exports = config
