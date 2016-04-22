/* eslint-env node */
/* eslint no-var: 0, func-names: 0, prefer-arrow-callback: 0, no-console: 0, prefer-template: 0 */
'use-strict'

var path = require('path')
var autoprefixer = require('autoprefixer')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
var webpackIsomorphicToolsConfig = require('./webpack-isomorphic-tools-config')

module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json' }
    ]
  },
  postcss() {
    return [autoprefixer]
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
    new CleanWebpackPlugin(['dist'], { root: path.normalize(path.join(__dirname, '../')) }),
    new webpack.DefinePlugin({
      __DEV__: true
    }),
    new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig)
       .development(process.env.NODE_ENV === 'development')
  ]
}

