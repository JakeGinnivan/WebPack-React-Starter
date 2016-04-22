/* eslint-env node */
/* eslint no-var: 0, func-names: 0, prefer-arrow-callback: 0, no-console: 0, prefer-template: 0 */
'use-strict'

var webpack = require('webpack')
var config = require('./webpack.config.base')
var ExtractTextPlugin = require('extract-text-plugin')

config.devtool = 'source-map'
config.entry = './app/index'
config.output.filename = 'bundle.[chunkhash].js'

config.module.loaders.push({
  test: /^((?!\.module).)*\.s?css$/,
  loader: ExtractTextPlugin.extract('style-loader', 'css!resolve-url!sass')
})
config.module.loaders.push({
  test: /\.module\.s?css$/,
  loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!resolve-url!sass')
})

config.plugins.push(
  new ExtractTextPlugin('style.[chunkhash].css', { allChunks: true }),
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
