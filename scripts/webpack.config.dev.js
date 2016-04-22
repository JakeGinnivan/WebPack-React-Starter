/* eslint-env node */
/* eslint no-var: 0, func-names: 0, prefer-arrow-callback: 0, no-console: 0, prefer-template: 0 */
'use-strict'

var webpack = require('webpack')
var config = require('./webpack.config.base')
var port = process.env.hot ? process.env.HOT_PORT : process.env.PORT

config.devtool = '#cheap-module-eval-source-map'

config.entry = [
  './app/index'
]
if (process.env.hot) {
  config.entry.unshift('webpack-hot-middleware/client?reload=true&path=http://localhost:' + port + '/__webpack_hmr')
}

config.output.publicPath = 'http://localhost:' + port + '/dist/'
config.output.devtoolModuleFilenameTemplate = function (info) {
  if (info.absoluteResourcePath.charAt(0) === '/') {
    return 'file://' + info.absoluteResourcePath
  }
  return 'file:///' + info.absoluteResourcePath
}
config.output.devtoolFallbackModuleFilenameTemplate = function (info) {
  if (info.absoluteResourcePath.charAt(0) === '/') {
    return 'file://' + info.absoluteResourcePath + '?' + info.hash
  }
  return 'file:///' + info.absoluteResourcePath + '?' + info.hash
}

config.module.loaders.push({
  test: /^((?!\.module).)*\.s?css$/,
  loaders: ['style-loader', 'css?importLoaders=1', 'postcss', 'resolve-url', 'sass']
})
config.module.loaders.push({
  test: /\.module\.s?css$/,
  loaders: [
    'style',
    'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
    'postcss',
    'resolve-url',
    'sass'
  ]
})

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    __DEV__: true,
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  })
)

module.exports = config

