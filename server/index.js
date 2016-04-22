require('babel-register')
require('./server')

global.__DEV__ = process.env.NODE_ENV === 'development'
