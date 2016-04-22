/* eslint-env node */
/* eslint no-var: 0, func-names: 0, prefer-arrow-callback: 0,
   no-console: 0, prefer-template: 0, vars-on-top: 0
*/
'use-strict'

require('babel-register')
var path = require('path')
var WebpackIsomorphicTools = require('webpack-isomorphic-tools')
var webpackIsomorphicConfigPath = path.resolve(__dirname, '..', 'scripts', 'webpack-isomorphic-tools-config')
var webpackIsomorphicConfig = require(webpackIsomorphicConfigPath)

global.__DEV__ = process.env.NODE_ENV === 'development'

// this must be equal to your Webpack configuration "context" parameter
var projectBase = require('path').resolve(__dirname, '..')

// this global variable will be used later in express middleware
global.webpack_isomorphic_tools = new WebpackIsomorphicTools(webpackIsomorphicConfig)
// enter development mode if needed
// (you may also prefer to use a Webpack DefinePlugin variable)
.development(process.env.NODE_ENV === 'development')
// initializes a server-side instance of webpack-isomorphic-tools
// (the first parameter is the base path for your project
//  and is equal to the "context" parameter of you Webpack configuration)
// (if you prefer Promises over callbacks
//  you can omit the callback parameter
//  and then it will return a Promise instead)
.server(projectBase, function () {
  // webpack-isomorphic-tools is all set now.
  // here goes all your web application code:
  // (it must reside in a separate *.js file
  //  in order for the whole thing to work)
  require('./server')
})
